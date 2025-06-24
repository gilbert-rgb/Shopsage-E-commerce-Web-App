from flask import Flask, request, jsonify, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash, generate_password_hash  # <-- Fixed here
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, get_jwt
)
from datetime import datetime, timezone

auth_bp = Blueprint("auth_bp", __name__)

# ======== Admin-Only: Create New User ============
@auth_bp.route("/admin/create_user", methods=["POST"])
@jwt_required()
def create_user_by_admin():
    admin_id = get_jwt_identity()
    admin = User.query.get(admin_id)

    if not admin or not admin.is_admin:
        return jsonify(error="Only admin users can perform this action"), 403

    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    is_admin = data.get("is_admin", True)

    if not username or not email or not password:
        return jsonify(error="Username, email, and password are required"), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify(error="User already exists"), 409

    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        is_admin=is_admin
    )
    db.session.add(user)
    db.session.commit()

    return jsonify(message="User created by admin"), 201

# -------------------- Login --------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return jsonify(error="Email and password are required to login"), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

    return jsonify(error="User does not exist or incorrect credentials"), 400

# -------------------- Current User --------------------
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def fetch_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify(error="User not found"), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "created_at": user.created_at
    }), 200
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    print("DEBUG - Headers received:", request.headers)

    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)

    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()

    return jsonify(success="Successfully logged out"), 200
