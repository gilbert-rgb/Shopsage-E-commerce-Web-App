from flask import Blueprint, request, jsonify
from models import db, Order, OrderItem, Product, User

order_bp = Blueprint("order_bp", __name__)

# Place an order
@order_bp.route("/orders", methods=["POST"])
def place_order():
    data = request.get_json()
    user_id = data.get("user_id")
    items = data.get("items")  # list of {"product_id": X, "quantity": Y}

    if not user_id or not items:
        return jsonify({"error": "User ID and items are required"}), 400

    order = Order(user_id=user_id)
    db.session.add(order)
    db.session.flush()  # to get order.id before commit

    for item in items:
        product = Product.query.get(item["product_id"])
        if not product or product.stock < item["quantity"]:
            db.session.rollback()
            return jsonify({"error": f"Product {item['product_id']} is unavailable or out of stock"}), 400

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


# View user's orders
@order_bp.route("/orders/<int:user_id>", methods=["GET"])
def get_orders(user_id):
    orders = Order.query.filter_by(user_id=user_id).all()
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
            "created_at": o.created_at,
            "items": items
        })

    return jsonify(order_list), 200
# Get All Orders for a Specific Product
@order_bp.route("/orders/product/<int:product_id>", methods=["GET"])
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
            "created_at": order.created_at,
            "quantity": item.quantity,
            "price_at_order": float(item.price_at_order)
        })

    return jsonify(orders), 200


#  Update an Order
@order_bp.route("/orders/<int:order_id>", methods=["PATCH"])
def update_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.get_json()
    new_status = data.get("status")
    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    order.status = new_status
    db.session.commit()
    return jsonify({"success": f"Order #{order.id} updated to '{new_status}'"}), 200

# Delete Order

@order_bp.route("/orders/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    # Delete associated order items first
    for item in order.order_items:
        db.session.delete(item)

    db.session.delete(order)
    db.session.commit()
    return jsonify({"success": f"Order #{order.id} and its items deleted"}), 200
