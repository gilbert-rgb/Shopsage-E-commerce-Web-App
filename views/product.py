from flask import Blueprint, request, jsonify
from models import db, Product, User
from datetime import datetime

product_bp = Blueprint("product_bp", __name__)

# Create product (admin only)
@product_bp.route("/products", methods=["POST"])
def create_product():
    data = request.get_json()
    name = data.get("name")
    price = data.get("price")
    stock = data.get("stock", 0)
    description = data.get("description", "")
    created_by = data.get("created_by")

    if not name or price is None or created_by is None:
        return jsonify({"error": "Name, price, and creator ID required"}), 400

    user = User.query.get(created_by)
    if not user or not user.is_admin:
        return jsonify({"error": "Only admin users can add products"}), 403

    product = Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        created_by=created_by
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({"success": "Product created", "product_id": product.id}), 201


# Get all products
@product_bp.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "stock": p.stock,
            "created_by": p.created_by
        } for p in products
    ]), 200


# Get single product
@product_bp.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": float(product.price),
        "stock": product.stock,
        "created_by": product.created_by
    }), 200

    #update_product

@product_bp.route("/products/<int:product_id>", methods=["PATCH"])
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json()
    user_id = data.get("user_id")  # Admin user ID required to authorize

    admin = User.query.get(user_id)
    if not admin or not admin.is_admin:
        return jsonify({"error": "Only admin users can update products"}), 403

    # Update fields if provided
    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)

    db.session.commit()
    return jsonify({"success": "Product updated successfully"}), 200

    # Delete Product

@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    user_id = request.args.get("user_id")
    admin = User.query.get(user_id)
    if not admin or not admin.is_admin:
        return jsonify({"error": "Only admin users can delete products"}), 403

    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": "Product deleted successfully"}), 200
