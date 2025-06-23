from app import app
from models import db, User
from werkzeug.security import generate_password_hash

def create_admin_user():
    with app.app_context():
        # Check if an admin user already exists
        admin = User.query.filter_by(username="admin").first()

        if admin:
            print(" Admin user already exists. No changes made.")
        else:
            # Create a new admin user
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
