from flask import Flask,request, jsonify
from models import db,User, Product, Order, OrderItem, Review
from flask_migrate import Migrate
from flask_mail import Mail

app = Flask(__name__)

# Config (SQLite used here, change as needed)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shopsage.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB and Migrate
db.init_app(app)
migrate = Migrate(app, db)

# mail configurations
app.config['MAIL_SERVER'] = 'smtp.gmail.com' 
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config["MAIL_USE_SSL"] = False
app.config['MAIL_USERNAME'] = 'gilbert.icheboi@student.moringaschool.com'
app.config['MAIL_PASSWORD'] = 'rzcy ydmk sutz yzmq' 
app.config['MAIL_DEFAULT_SENDER'] = 'yourmail@gmail.com'

mail = Mail(app)


# Import models after db is defined
from models import User, Product, Order, OrderItem, Review


# Register Blueprints
from views import *

app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(order_bp)
app.register_blueprint(review_bp)


if __name__ == '__main__':
    app.run(debug=True)
