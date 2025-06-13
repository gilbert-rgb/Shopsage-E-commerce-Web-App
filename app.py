from flask import Flask,request, jsonify
from models import db,User, Product, Order, OrderItem, Review
from flask_migrate import Migrate

app = Flask(__name__)

# Config (SQLite used here, change as needed)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shopsage.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB and Migrate
db.init_app(app)
migrate = Migrate(app, db)

# Import models after db is defined
from models import User, Product, Order, OrderItem, Review


# Register Blueprints
from views import *

# app.register_blueprint()
# app.register_blueprint()
# app.register_blueprint()
# app.register_blueprint()


if __name__ == '__main__':
    app.run(debug=True)
