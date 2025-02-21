import os
from flask import Flask
from flask_cors import CORS

from application.config import DevelopConfig
from application.database import db

app=None
def create_app():
    app = Flask(__name__, template_folder='templates')
    app.config.from_object(DevelopConfig)
    db.init_app(app)
    cors = CORS(app)
    app.app_context().push()
    return app

app = create_app()

from application.controllers import *

if __name__=='__main__':
    app.run(host='0.0.0.0')