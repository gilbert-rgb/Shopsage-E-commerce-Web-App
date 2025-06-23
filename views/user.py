from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models import db, User
from flask_mail import Message
from app import app, mail

user_bp = Blueprint("user_bp", __name__)

# Register New User

@user_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required."}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists."}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()

        msg = Message(
            subject="Welcome to ShopSage",
            recipients=[email],
            sender=app.config['MAIL_DEFAULT_SENDER'],
            body=f"Hello {username},\n\nThank you for registering on ShopSage.\n\nBest regards,\nShopSage Team"
        )
        mail.send(msg)

        return jsonify({"success": "User registered and welcome email sent."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


# Update User
@user_bp.route("/users/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.is_admin = data.get("is_admin", user.is_admin)

    try:
        db.session.commit()

        msg = Message(
            subject="Profile Updated",
            recipients=[user.email],
            sender=app.config['MAIL_DEFAULT_SENDER'],
            body=f"Hello {user.username},\n\nYour profile has been updated.\n\nBest,\nShopSage Team"
        )
        mail.send(msg)

        return jsonify({"success": "User updated successfully."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

#  Get User by ID
@user_bp.route("/users/<int:user_id>", methods=["GET"])
def fetch_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "created_at": user.created_at.isoformat()
    }), 200

# Get All Users
@user_bp.route("/users", methods=["GET"])
def fetch_all_users():
    users = User.query.all()

    user_list = []
    for user in users:
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "created_at": user.created_at
        }
        user_list.append(user_data)
        
    return jsonify(user_list), 200

#  Delete User

@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": "User deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Delete failed: {str(e)}"}), 500
