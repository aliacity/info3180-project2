from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.config['SECRET_KEY'] = "v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://ecqligmwcstofw:88726cecf3915d2a6af53844ab4e5ca2874df42e1fb2b3016de1f7eb8e31b38c@ec2-54-225-129-101.compute-1.amazonaws.com:5432/df7inpaidfb2su'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
app.config['UPLOAD_FOLDER'] = './app/static/uploads'
app.config['GET_FILE'] = './static/uploads'

db = SQLAlchemy(app)
csrf = CSRFProtect(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views