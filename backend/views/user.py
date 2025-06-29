from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models import db, User
from flask_mail import Message
from app import app, mail
from datetime import datetime

user_bp = Blueprint("user_bp", __name__)

# ---------------- Register New User ----------------
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

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        is_admin=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        # Send welcome email
        try:
            msg = Message(
                subject="Welcome to ShopSage",
                recipients=[email],
                sender=app.config['MAIL_DEFAULT_SENDER'],
                body=f"Hello {username},\n\nThank you for registering on ShopSage.\n\nBest regards,\nShopSage Team"
            )
            mail.send(msg)
        except Exception as mail_err:
            print(f"[MAIL ERROR] {mail_err}")

        return jsonify({"success": "User registered."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

# ---------------- Update User ----------------
@user_bp.route("/users/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.is_admin = data.get("is_admin", user.is_admin)

    # Optional password update
    if "password" in data and data["password"]:
        user.password_hash = generate_password_hash(data["password"], method="pbkdf2:sha256")

    user.updated_at = datetime.utcnow()

    try:
        db.session.commit()

        # Send profile update email
        try:
            msg = Message(
                subject="Profile Updated",
                recipients=[user.email],
                sender=app.config['MAIL_DEFAULT_SENDER'],
                body=f"Hello {user.username},\n\nYour profile has been updated.\n\nBest,\nShopSage Team"
            )
            mail.send(msg)
        except Exception as mail_err:
            print(f"[MAIL ERROR] {mail_err}")

        return jsonify({"success": "User updated successfully."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

# ---------------- Get User by ID ----------------
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

# ---------------- Get All Users ----------------
@user_bp.route("/users", methods=["GET"])
def fetch_all_users():
    users = User.query.all()
    user_list = [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "is_admin": u.is_admin,
        "created_at": u.created_at.isoformat()
    } for u in users]

    return jsonify(user_list), 200

# ---------------- Delete User ----------------
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
