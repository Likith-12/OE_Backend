import os

basedir=os.path.abspath(os.path.dirname(__file__))

class Config():
    DEBUG = False
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = None
    UPLOAD_FOLDER = None

class DevelopConfig(Config):
    DEBUG = True
    
    # for using sqlite3 for testing
    #SQLITE_DB_DIR = os.path.join(basedir,"../db_directory/")
    #SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR,"appdb.sqlite3")
    
    #using mysql
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:password123@localhost/open_elective_allocation"
    
    SECRET_KEY = "NoNeedForSDLC!AgileBetterThanWaterfall!"
    UPLOAD_FOLDER = os.path.join(basedir,"../static/")