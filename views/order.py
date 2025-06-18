from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, Product, User
from sqlalchemy.orm import joinedload

order_bp = Blueprint("order_bp", __name__)

# Place an order
@order_bp.route("/orders", methods=["POST"])
@jwt_required()
def place_order():
    data = request.get_json()
    user_id = get_jwt_identity()
    items = data.get("items")  # list of {"product_id": X, "quantity": Y}

    if not items:
        return jsonify({"error": "Items are required"}), 400

    try:
        order = Order(user_id=user_id)
        db.session.add(order)
        db.session.flush()

        for item in items:
            product = Product.query.get(item["product_id"])
            if not product or product.stock < item["quantity"]:
                raise ValueError(f"Product {item['product_id']} is unavailable or out of stock")

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item["quantity"],
                price_at_order=product.price
            )
            product.stock -= item["quantity"]
            db.session.add(order_item)

        db.session.commit()
        return jsonify({"success": "Order placed", "order_id": order.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# View user's orders
@order_bp.route("/orders/<int:user_id>", methods=["GET"])
@jwt_required()
def get_orders(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    orders = Order.query.options(joinedload(Order.order_items)).filter_by(user_id=user_id).all()
    order_list = []

    for o in orders:
        items = [
            {
                "product_id": i.product_id,
                "quantity": i.quantity,
                "price_at_order": float(i.price_at_order)
            }
            for i in o.order_items
        ]
        order_list.append({
            "order_id": o.id,
            "status": o.status,
            "created_at": o.created_at.isoformat(),
            "items": items
        })

    return jsonify(order_list), 200


# Get all orders for a specific product
@order_bp.route("/orders/product/<int:product_id>", methods=["GET"])
@jwt_required()
def get_orders_for_product(product_id):
    order_items = OrderItem.query.filter_by(product_id=product_id).all()

    if not order_items:
        return jsonify({"message": "No orders found for this product"}), 404

    orders = []
    for item in order_items:
        order = item.order
        orders.append({
            "order_id": order.id,
            "user_id": order.user_id,
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            "quantity": item.quantity,
            "price_at_order": float(item.price_at_order)
        })

    return jsonify(orders), 200


# Update order (only the owner can update)
@order_bp.route("/orders/<int:order_id>", methods=["PATCH"])
@jwt_required()
def update_order(order_id):
    current_user_id = get_jwt_identity()
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404
    if order.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    new_status = data.get("status")
    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    order.status = new_status
    db.session.commit()
    return jsonify({"success": f"Order #{order.id} updated to '{new_status}'"}), 200


# Delete order (only the owner can delete)
@order_bp.route("/orders/<int:order_id>", methods=["DELETE"])
@jwt_required()
def delete_order(order_id):
    current_user_id = get_jwt_identity()
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404
    if order.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    for item in order.order_items:
        db.session.delete(item)

    db.session.delete(order)
    db.session.commit()
    return jsonify({"success": f"Order #{order.id} and its items deleted"}), 200
