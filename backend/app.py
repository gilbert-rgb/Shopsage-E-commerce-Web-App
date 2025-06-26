from datetime import timedelta
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Models
from models import db, TokenBlocklist, User, Product, Order, OrderItem, Review

# App initialization
app = Flask(__name__)

# ------------------- Configuration -------------------

# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://shopsage_db_user:llqErpMpeynR1XKszCxbpP9zGLxaxM1N@dpg-d1e55ingi27c7389cn80-a.oregon-postgres.render.com/shopsage_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT
app.config["JWT_SECRET_KEY"] = "fryuimnbvjsefvyilgfvksbhvfiknhalvufn"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
app.config["JWT_VERIFY_SUB"] = False

 

  

# Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config["MAIL_USE_SSL"] = False
app.config['MAIL_USERNAME'] = 'gilbert.icheboi@gmail.com'
app.config['MAIL_PASSWORD'] = 'rzcy ydmk sutz yzmq'  # Consider loading from ENV
app.config['MAIL_DEFAULT_SENDER'] = 'yourmail@gmail.com'

# CORS
CORS(app, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173"
], supports_credentials=True)

# ------------------- Initialize Extensions -------------------
db.init_app(app)
migrate = Migrate(app, db)
mail = Mail(app)
jwt = JWTManager(app)

# ------------------- Register Blueprints -------------------
from views import auth_bp, user_bp, product_bp, order_bp, review_bp
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(order_bp)
app.register_blueprint(review_bp)

# ------------------- Token Blocklist Checker -------------------
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload.get("jti")
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

# ------------------- Run App -------------------
if __name__ == '__main__':
    app.run(debug=True)
