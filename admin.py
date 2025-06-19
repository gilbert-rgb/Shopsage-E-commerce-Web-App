from app import app
from models import db, User, Product  # Make sure Product is imported
from werkzeug.security import generate_password_hash

def create_admin_user():
    with app.app_context():
        # Step 1: Find existing admin
        admin = User.query.filter_by(username="admin").first()

        # Step 2: Remove related products created by admin (to avoid foreign key error)
        if admin:
            products = Product.query.filter_by(created_by=admin.id).all()
            for product in products:
                db.session.delete(product)
            db.session.delete(admin)
            db.session.commit()
            print(" Existing admin and related products deleted.")
        else:
            print("No existing admin to delete.")

        # Step 3: Create new admin user
        new_admin = User(
            username="admin",
            email="admin@gmail.com",
            password_hash=generate_password_hash("1234"),
            is_admin=True
        )
        db.session.add(new_admin)
        db.session.commit()
        print(" New admin created: admin@gmail.com / 1234")

if __name__ == "__main__":
    create_admin_user()
