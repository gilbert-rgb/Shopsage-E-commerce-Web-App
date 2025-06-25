import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Blueprint, request, jsonify
from models import db, Product, User
from flask_jwt_extended import jwt_required, get_jwt_identity

product_bp = Blueprint("product_bp", __name__)

# -------------------- Create Product (Admin Only) --------------------
@product_bp.route("/products", methods=["POST"])
@jwt_required()
def create_product():
    current_user = User.query.get(get_jwt_identity())
    if not current_user or not current_user.is_admin:
        return jsonify({"error": "Only admin users can add products"}), 403

    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()
    name = data.get("name")
    price = data.get("price")
    stock = data.get("stock", 0)
    description = data.get("description", "")
    image = data.get("image", "")  

    if not name or price is None:
        return jsonify({"error": "Name and price are required"}), 400

    try:
        price = float(price)
        stock = int(stock)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid price or stock value"}), 400
    
    

    if Product.query.filter_by(name=name).first():
        return jsonify({"error": "Product with this name already exists"}), 409

    product = Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        image=image,  
        created_by=current_user.id
    )
    db.session.add(product)
    db.session.commit()

    return jsonify({
        "success": "Product created",
        "product": {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": float(product.price),
            "stock": product.stock,
            "image": product.image,
            "created_by": product.created_by
        }
    }), 201

# -------------------- Get All Products --------------------
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
            "image": p.image,
            "created_by": p.created_by
        } for p in products
    ]), 200

# -------------------- Get Single Product --------------------
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
        "image": product.image,
        "created_by": product.created_by
    }), 200

# -------------------- Update Product (Admin Only) --------------------
@product_bp.route("/products/<int:product_id>", methods=["PATCH"])
@jwt_required()
def update_product(product_id):
    current_user = User.query.get(get_jwt_identity())
    if not current_user or not current_user.is_admin:
        return jsonify({"error": "Only admin users can update products"}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()
    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)
    product.image = data.get("image", product.image)  # ✅ Update image too

    db.session.commit()
    return jsonify({"success": "Product updated successfully"}), 200

# -------------------- Delete Product (Admin Only) --------------------
@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    current_user = User.query.get(get_jwt_identity())
    if not current_user or not current_user.is_admin:
        return jsonify({"error": "Only admin users can delete products"}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": "Product deleted successfully"}), 200

# -------------------- Promote User to Admin (Admin Only) --------------------
@product_bp.route("/promote/<int:user_id>", methods=["PATCH"])
@jwt_required()
def promote_user(user_id):
    current_user = User.query.get(get_jwt_identity())
    if not current_user or not current_user.is_admin:
        return jsonify({"error": "Only admin users can promote users"}), 403

    user_to_promote = User.query.get(user_id)
    if not user_to_promote:
        return jsonify({"error": "User not found"}), 404

    if user_to_promote.is_admin:
        return jsonify({"message": "User is already an admin"}), 200

    user_to_promote.is_admin = True
    db.session.commit()

    return jsonify({"success": f"User {user_id} has been promoted to admin"}), 200
