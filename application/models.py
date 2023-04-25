from application.database import db

class Student(db.Model):
    __tablename__ = 'student'
    roll_no = db.Column(db.String(20), primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    programme = db.Column(db.String(50), nullable=False)
    batch = db.Column(db.String(10), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    FA = db.Column(db.String(50), nullable=False)
    preference = db.relationship('Preference', backref='student', lazy=True)
    allocation = db.relationship('Allocation', backref='student', lazy=True)

class Course(db.Model):
    __tablename__ = 'course'
    course_id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(50), nullable=False)
    s5 = db.Column(db.Integer, nullable=False)
    s6 = db.Column(db.Integer, nullable=False)
    s7 = db.Column(db.Integer, nullable=False)
    s8 = db.Column(db.Integer, nullable=False)
    s9 = db.Column(db.Integer, nullable=False)
    s10 = db.Column(db.Integer, nullable=False)
    faculty = db.Column(db.String(50), nullable=False)
    AR = db.Column(db.Integer,nullable=False)
    BT = db.Column(db.Integer,nullable=False)
    CH = db.Column(db.Integer,nullable=False)
    CE = db.Column(db.Integer,nullable=False)
    CS = db.Column(db.Integer,nullable=False)
    EE = db.Column(db.Integer,nullable=False)
    EC = db.Column(db.Integer,nullable=False)
    ME = db.Column(db.Integer,nullable=False)
    EP = db.Column(db.Integer,nullable=False)
    PE = db.Column(db.Integer,nullable=False)
    MT = db.Column(db.Integer,nullable=False)
    preference = db.relationship('Preference', backref='course', lazy=True)
    allocation = db.relationship('Allocation', backref='course', lazy=True)


class Faculty(db.Model):
    __tablename__ = 'faculty'
    employee_code = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(50), nullable=False)
    
class Deadline(db.Model):
    __tablename__ = 'deadline'
    deadline_type = db.Column(db.String(50), primary_key=True)
    date = db.Column(db.String(50))

class Preference(db.Model):
    __tablename__ = 'preference'
    roll_no = db.Column(db.String(20), db.ForeignKey('student.roll_no'), primary_key=True)
    course_id = db.Column(db.String(20), db.ForeignKey('course.course_id'), primary_key=True)
    pref_no = db.Column(db.Integer, nullable=False)
    
class Allocation(db.Model):
    __tablename__ = 'allocation'
    roll_no = db.Column(db.String(20), db.ForeignKey('student.roll_no'), primary_key=True)
    course_id = db.Column(db.String(20), db.ForeignKey('course.course_id'), primary_key=True)
