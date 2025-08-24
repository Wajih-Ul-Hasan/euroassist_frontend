from app import create_app

# create a WSGI app for production servers (gunicorn, etc.)
app = create_app()
