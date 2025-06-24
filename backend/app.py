from datetime import timedelta
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS  # <-- Add this

from models import db, TokenBlocklist

app = Flask(__name__)

# ------------------ Configuration ------------------
# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shopsage.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT
app.config["JWT_SECRET_KEY"] = "fryuimnbvjsefvyilgfvksbhvfiknhalvufn"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)
app.config["JWT_VERIFY_SUB"] = False

# Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config["MAIL_USE_SSL"] = False
app.config['MAIL_USERNAME'] = 'gilbert.icheboi@student.com'
app.config['MAIL_PASSWORD'] = 'rzcy ydmk sutz yzmq' 
app.config['MAIL_DEFAULT_SENDER'] = 'yourmail@gmail.com'

# CORS (Allow frontend dev server at 5173)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# ------------------ Initialize Extensions ------------------
db.init_app(app)
migrate = Migrate(app, db)
mail = Mail(app)
jwt = JWTManager(app)

# ------------------ Models ------------------
from models import User, Product, Order, OrderItem, Review

# ------------------ Blueprints ------------------
from views import *
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(order_bp)
app.register_blueprint(review_bp)

# ------------------ JWT Token Blocklist Checker ------------------
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

# ------------------ Run App ------------------
if __name__ == '__main__':
    app.run(debug=True)
