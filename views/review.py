from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Review, Product, User, Order

review_bp = Blueprint("review_bp", __name__)

#  Add a review
@review_bp.route("/reviews", methods=["POST"])
@jwt_required()
def add_review():
    data = request.get_json()
    user_id = get_jwt_identity()
    product_id = data.get("product_id")
    rating = data.get("rating")
    comment = data.get("comment", "")

    if not all([product_id, rating]):
        return jsonify({"error": "Product ID and rating are required"}), 400

    # Check if user already reviewed this product
    existing = Review.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        return jsonify({"error": "You already reviewed this product"}), 400

    review = Review(user_id=user_id, product_id=product_id, rating=rating, comment=comment)
    db.session.add(review)
    db.session.commit()

    return jsonify({"success": "Review submitted"}), 201


#  Get All Reviews for a Specific Product
@review_bp.route("/reviews/product/<int:product_id>", methods=["GET"])
def get_reviews_for_product(product_id):
    reviews = Review.query.filter_by(product_id=product_id, is_visible=True).all()

    if not reviews:
        return jsonify({"message": "No reviews found for this product"}), 404

    review_list = []
    for review in reviews:
        review_list.append({
            "id": review.id,
            "user_id": review.user_id,
            "username": review.author.username,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at.isoformat()
        })

    return jsonify(review_list), 200


#  Get Reviews for All Products in a Specific Order
@review_bp.route("/reviews/order/<int:order_id>", methods=["GET"])
@jwt_required()
def get_reviews_for_order(order_id):
    current_user_id = get_jwt_identity()
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404
    if order.user_id != current_user_id:
        return jsonify({"error": "Unauthorized access to this order"}), 403

    product_ids = [item.product_id for item in order.order_items]

    reviews = Review.query.filter(
        Review.product_id.in_(product_ids),
        Review.is_visible == True
    ).all()

    if not reviews:
        return jsonify({"message": "No reviews found for this order's products"}), 404

    review_list = []
    for review in reviews:
        review_list.append({
            "id": review.id,
            "product_id": review.product_id,
            "product_name": review.product.name,
            "user_id": review.user_id,
            "username": review.author.username,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at.isoformat()
        })

    return jsonify(review_list), 200


#  Edit Review
@review_bp.route("/reviews/<int:review_id>", methods=["PATCH"])
@jwt_required()
def update_review(review_id):
    current_user_id = get_jwt_identity()
    review = Review.query.get(review_id)

    if not review:
        return jsonify({"error": "Review not found"}), 404
    if review.user_id != current_user_id:
        return jsonify({"error": "Unauthorized to edit this review"}), 403

    data = request.get_json()
    review.rating = data.get("rating", review.rating)
    review.comment = data.get("comment", review.comment)
    db.session.commit()

    return jsonify({"success": "Review updated"}), 200


#  Delete Review
@review_bp.route("/reviews/<int:review_id>", methods=["DELETE"])
@jwt_required()
def delete_review(review_id):
    current_user_id = get_jwt_identity()
    review = Review.query.get(review_id)

    if not review:
        return jsonify({"error": "Review not found"}), 404
    if review.user_id != current_user_id:
        return jsonify({"error": "Unauthorized to delete this review"}), 403

    db.session.delete(review)
    db.session.commit()
    return jsonify({"success": "Review deleted"}), 200
