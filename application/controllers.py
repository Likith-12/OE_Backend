from flask import current_app as app
from flask import request,jsonify,make_response,send_file
from functools import wraps
from application.models import *
from application import utilities
import pandas as pd
import requests
import jwt
import os
import zipfile
from datetime import datetime

#token_check decorator to authenticate and authorize user
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token=None
        
        #check for token in request header
        if 'token' in request.headers:
            token=request.headers['token']
        if not token:
            return make_response("Unauthorized access",401)

        try:
            #decoding token and identifying user role
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            
            if data['role'] == 'student':
                current_user = Student.query.filter_by(email = data['email']).first()
            elif data['role'] == 'faculty' or data['role'] == 'fa':
                current_user = Faculty.query.filter_by(email = data['email']).first()
            else:
                current_user = 'Admin'
            role = data ["role"]
        except:
            return make_response("Could not Verify",401,{"Auth_Status":"invalid"})

        return f(current_user,role,*args,**kwargs)
    return decorated


@app.route('/login', methods=['GET'])
def login():
    
    #extract token from request url parameter
    token=request.args.get('token')
    if not token:
        return jsonify({'error':'token not found'}),400
    
    #extracting user data from google using received token
    token_data=requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}").json()
    
    if not token_data:
        return jsonify({'error':'token not valid'}),400
    
    #check if user is an admin
    if token_data['email'] == 'dao@nitc.ac.in':
        user_data = {}
        user_data['role'] = 'admin'
        user_data['name'] = token_data['name']
    else:
        user = Faculty.query.filter_by(email=token_data['email']).first()
        if user is not None:
            user_data = utilities.faculty_dict(user)
            user_data['role'] = 'faculty'

            FA_check = Student.query.filter_by(FA=token_data['email']).first()
            if FA_check is not None:
                user_data['role'] = 'fa'
        else:
            user = Student.query.filter_by(email=token_data['email']).first()
            if user is not None:
                user_data = utilities.student_dict(user)
                user_data['role'] = 'student'
   
        if user is None:
            return jsonify({'error':'invalid user'}),404
        
    user_data['email'] = token_data['email']
    user_data['picture'] = token_data['picture']
    
    #create jwt token with user role
    ret_token=jwt.encode(user_data, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'token':ret_token,
        'user':user_data
    }),200
    
@app.route('/timeline', methods=['GET'])
@token_required
def get_timeline(current_user,role):
    
    #check to see if deadline passed
    
    #extracting deadline
    deadline = Deadline.query.first()

    if deadline is None or deadline.date is None:
        deadline_passed = False
    else:
        deadline_date = datetime.strptime(deadline.date, '%Y-%m-%d')
        
        #check with current time
        if deadline_date.date() <= datetime.now().date():
            deadline_passed = True
        else:
            deadline_passed = False
    
    #check if student preference filled
    preference_filled = False
    if role == 'student':
        pref = Preference.query.filter_by(roll_no = current_user.roll_no).all()
        if len(pref)!=0:
            preference_filled = True
            
    #check if allocation made
    if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/allocation_list.csv")):
        allocated = True
    else:
        allocated = False

    if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/random_list.csv")):
        random_list_present = True
    else:
        random_list_present = False
    
    #check to see if allocation is made   
    allocation_list = Allocation.query.all()

    if len(allocation_list) ==0:
        approve_allocation = False
    else:
        approve_allocation = True
    
    return jsonify({
        "deadline_passed": deadline_passed,
        "allocated": allocated,
        "allocation_approved":approve_allocation,
        "preference_filled": preference_filled,
        "random_list_present": random_list_present}),200
    
@app.route('/upload_students', methods=['POST'])
@token_required
def upload_students(current_user,role):
    #authorized user check
    if role != 'admin':
        return jsonify({'error':'unauthorized access'}),401
    
    #get student list from uploaded file
    student_list=request.files.get('file')
    
    if not student_list:
        return jsonify({'error':'file not found'}),400
    
    #header list for the spreadsheet
    headers = ['sl_no', 'roll_no', 'name', 'email', 'programme','semester','admission_year', 'batch', 'FA_name' , 'FA']

    #change file to dataframe based on file type
    if student_list.filename.split(".")[-1] == "csv":
        students_df = pd.read_csv(student_list, skiprows=1, names=headers)
    elif student_list.filename.split(".")[-1] == "xlsx" or student_list.filename.split(".")[-1] == "xls":
        students_df = pd.read_excel(student_list, skiprows=1, names=headers)
    else:
        return jsonify({'error':'invalid format'}),400
    
    
    #upload file to db
    try:
        students_df.drop(['sl_no', 'admission_year', 'FA_name'], axis=1, inplace=True)
        students_df['semester'] = students_df['semester'].astype(int) + 1
        
        #removing existing data
        students = Student.query.all()
        for student in students:
            db.session.delete(student)
        db.session.commit()
        
        #passing new data to the table
        students_df.to_sql(name = 'student', con=app.config['SQLALCHEMY_DATABASE_URI'], index=False, if_exists='append')
    except Exception as e:
        print(e)
        return jsonify({'error':'invalid file'}),400
    
    students_df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/student_list.csv"), index=False)
    
    return jsonify({'success': 'file_uploaded'}),200


@app.route('/upload_faculties', methods=['POST'])
@token_required
def upload_faculties(current_user,role):
    
    #authorized user check
    if role != 'admin':
        return jsonify({'error':'unauthorized access'}),401
    
    #get faculty list from uploaded file
    faculty_list=request.files.get('file')
    
    if not faculty_list:
        return jsonify({'error':'file not found'}),400
    
    #header list for the spreadsheet
    headers = ['sl_no', 'employee_code', 'name', 'email', 'department']

    #change file to dataframe based on file type
    if faculty_list.filename.split(".")[-1] == "csv":
        faculty_df = pd.read_csv(faculty_list, skiprows=1, names=headers)
    elif faculty_list.filename.split(".")[-1] == "xlsx" or faculty_list.filename.split(".")[-1] == "xls":
        faculty_df = pd.read_excel(faculty_list, skiprows=1, names=headers)
    else:
        return jsonify({'error':'invalid format'}),400
    
    
    #upload file to db
    try:
        faculty_df.drop(['sl_no'], axis=1, inplace=True)
        
        #removing existing data
        faculties = Faculty.query.all()
        for faculty in faculties:
            db.session.delete(faculty)
        db.session.commit()
        
        #addign new data to the table
        faculty_df.to_sql(name = 'faculty', con=app.config['SQLALCHEMY_DATABASE_URI'], index=False, if_exists='append')
    except Exception as e:
        print(e)
        return jsonify({'error':'invalid file'}),400
    
    faculty_df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/faculty_list.csv"), index=False)
    
    return jsonify({'success': 'file_uploaded'}),200

@app.route('/upload_courses', methods=['POST'])
@token_required
def upload_courses(current_user,role):
    
    #authorized user check
    if role != 'admin':
        return jsonify({'error':'unauthorized access'}),401
    
    #get course list from uploaded file
    course_list=request.files.get('file')
    
    if not course_list:
        return jsonify({'error':'file not found'}),400
    
    #header list for the spreadsheet
    headers = ['course_id', 'name', 'department', 's5', 's6', 's7', 's8', 's9', 's10', 'faculty', 'slot', 'AR', 'BT', 'CH', 'CE', 'CS', 'EE', 'EC', 'ME', 'EP', 'PE', 'MT']

    #change file to dataframe based on file type
    if course_list.filename.split(".")[-1] == "csv":
        course_df = pd.read_csv(course_list, skiprows=1, names=headers)
    elif course_list.filename.split(".")[-1] == "xlsx" or course_list.filename.split(".")[-1] == "xls":
        course_df = pd.read_excel(course_list, skiprows=1, names=headers)
    else:
        return jsonify({'error':'invalid format'}),400
    
    
    #upload file to db
    try:
        course_df['course_id'] = course_df['course_id'] + '-' + course_df['slot']
        course_df.drop(columns=['slot'], inplace=True)
        
        #removing existing data
        courses = Course.query.all()
        for course in courses:
            db.session.delete(course)
        db.session.commit()
        
        #adding new data to the table
        course_df.to_sql(name = 'course', con=app.config['SQLALCHEMY_DATABASE_URI'], index=False, if_exists='append')
    except Exception as e:
        print(e)
        return jsonify({'error':'invalid file'}),400
    
    course_df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/course_list.csv"), index=False)    
    
    return jsonify({'success': 'file_uploaded'}),200

@app.route('/deadline', methods=['GET', 'POST'])
@token_required
def deadline(current_user,role):
    
    #authorized user check
    if role != 'admin':
        return jsonify({'error':'unauthorized access'}),401
    
    if request.method == "GET":
        #obtain deadline from db
        deadline = Deadline.query.first()
        if deadline is None:
            return jsonify({'error':'No Deadline Set'}),404
        else:
            return jsonify({'deadline':deadline.date}),200
    else:
        
        # get deadline from request in yyyy-mm-dd format
        date = request.json.get('deadline')
        if date is None:
            return jsonify({'error':'No Deadline Given'}),404
        
        #formatting the date
        try:
            formated_date = datetime.strptime(date, '%Y-%m-%d')
        except Exception as e:
            print(e)
            return jsonify({'error':'Invalid Date'}),400
        
        if formated_date.date() <= datetime.now().date():
            return jsonify({'error':'Enter a Future date'}),400

        #update deadline in db
        deadline_slot = Deadline.query.first()
        if deadline_slot is None:
            deadline_slot = Deadline(deadline_type="Preference Deadline",date=date)
            db.session.add(deadline_slot)
        else:
            deadline_slot.date = date
        db.session.commit()
        
        return jsonify({'success':'Deadline Updated'}),200
    

@app.route('/reset', methods=['GET'])
@token_required
def reset_without_backup(current_user,role):
    
    #authorized user check
    if role != 'admin':
        return jsonify({'error':'unauthorized access'}),401
    
    utilities.delete_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup"))
    utilities.delete_csv(app.config['UPLOAD_FOLDER'])

    if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'],"backup.zip")):
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'],"backup.zip"))
    
    #delete all allocation data from db
    Allocation.query.delete()
    #delete all preferences data from db
    Preference.query.delete()
    #delete all student data from db
    Student.query.delete()
    #delete all faculty data from db
    Faculty.query.delete()
    #delete all course data from db
    Course.query.delete()
    #remove deadline from db
    deadline = Deadline.query.first()
    deadline.date = None
    
    db.session.commit()
    
    return jsonify({'success':'Reset Successful'}),200

@app.route('/backup', methods=['GET'])
def backup():
    folder_path = os.path.join(app.config['UPLOAD_FOLDER'],"Backup")
    zip_path = os.path.join(app.config['UPLOAD_FOLDER'],"backup.zip")

    # create a ZipFile object
    zip_obj = zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED)

    os.chdir(folder_path)
    
    # iterate over all the files in the folder
    for foldername, subfolders, filenames in os.walk(folder_path):
        for filename in filenames:
            # create the full file path by joining the folder path and file name
            file_path = os.path.join(folder_path, filename)
            # add the file to the zip archive
            zip_obj.write(file_path, os.path.basename(file_path))

    # close the ZipFile
    zip_obj.close()

    return send_file(zip_path, as_attachment=True)

@app.route('/preferences', methods=['GET','POST'])
@token_required
def preferences(current_user,role):
    #authorized user check
    if role != 'student':
        return jsonify({'error':'unauthorized access'}),401
    
    if request.method == 'GET':
        #getting batch and sem information of current user
        branch = current_user.roll_no[-2:]
        sem = current_user.semester
        
        #getting the appropriate course list from db
        courses = Course.query.filter(getattr(Course, "s"+str(sem)) == 1, getattr(Course, branch) != 0).all()
        course_list = [utilities.course_dict(course) for course in courses]
        
        return jsonify({'courses':course_list}),200
    else:
        #time check
        deadline = Deadline.query.first()
        if deadline is not None and deadline.date is not None:
            if datetime.strptime(deadline.date, '%Y-%m-%d').date() < datetime.now().date():
                return jsonify({'error':'Deadline Over'}),400

        #get data from request
        preferences = request.json.get('preferences')
        if preferences is None:
            return jsonify({'error':'Invalid Request'}),404
        
        #saving preferences to db
        for i,pref in enumerate(preferences):
            p = Preference(roll_no = current_user.roll_no, course_id = pref['course_id'] + "-" + pref["slot"], pref_no = i + 1)
            db.session.add(p)
            db.session.commit()
        return jsonify({'success':'preferences saved'}),200
    

@app.route('/random_list', methods=['GET','POST'])
@token_required
def generate_random_list(current_user,role):
    
    #authorized user check
    if role != 'admin':
        return jsonify({'error':'unauthorized access'}),401
    
    if request.method == 'GET':
        try:
            headers = ["roll_no", "name", "email", "programme", "semester", "batch"]
            student_df = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/random_list.csv"), skiprows=1, names=headers)
        except Exception as e:
            print(e)
            return jsonify({'error':'random list not generated'}),404
        
        random_list = []
        for index, row in student_df.iterrows():
            random_list.append(row.to_dict())
            
        return jsonify({'random_list':random_list}),200
        
    else:
        student_list = utilities.findUniqueElements([pref_object.student for pref_object in Preference.query.all()])
        student_list = utilities.random_shuffle(student_list)
    
        #saving the random list to a dataframe with neccessary columns
        data = []
        for obj in student_list:
            data.append(obj.__dict__)
        preferences = pd.DataFrame(data, columns=["roll_no", "name", "email", "programme", "semester", "batch", "FA"])
        preferences.drop(['FA'], axis=1, inplace=True)
    
        #saving the random list to csv file
        preferences.to_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/random_list.csv"), index=False)
    
        student_list = [utilities.student_dict(student) for student in student_list]
    
        return jsonify({'random_list':student_list, 'success':'random list generated'}),200

@app.route('/allocate', methods=['GET','POST'])
@token_required
def allocate(current_user,role):
    
    #check for valid user
    if role != 'admin':
        return jsonify({'error':'unauthorized access'}),401
    
    if request.method == 'GET':
        try:
            headers = ["roll_no", "name", "email", "programme", "semester", "batch", "course_id", "course_name", "slot"]
            allocation_df = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/allocation_list.csv"), skiprows=1, names=headers)
        except Exception as e:
            print(e)
            return jsonify({'error':'allocation list not generated'}),404
        
        allocation_list = []
        for index, row in allocation_df.iterrows():
            allocation_list.append(row.to_dict())
            
        return jsonify({'allocation_list':allocation_list}),200
    else:
        try:
            random_list = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/random_list.csv"))
        except Exception as e:
            print(e)
            return jsonify({'error':'random list not found'}),404
        
        #creating allocation list
        allocation_list = random_list.copy()
        allocation_list ['course_id'] = ['Not Allocated' for i in range(len(allocation_list))]
        allocation_list ['course_name'] = ['Not Allocated' for i in range(len(allocation_list))]
        allocation_list ['slot'] = ['Not Allocated' for i in range(len(allocation_list))]
        
        #allotting courses to students
        for index, row in random_list.iterrows():
            roll = row['roll_no']
            
            #obtaining preferences
            preference_list = Preference.query.filter_by(roll_no=roll).order_by(Preference.pref_no).all()
            #getting branch of student
            branch = roll[-2:]
            
            for pref in preference_list:
                #checking for valid course
                course = pref.course
                if getattr(course, branch) > 0:
                    #updating allocation list
                    allocation_list.at[index,'course_id'] = course.course_id.split('-')[0]
                    allocation_list.at[index,'slot'] = course.course_id.split('-')[1]
                    allocation_list.at[index,'course_name'] = course.name
                    
                    #updating course db
                    new_count = getattr(course, branch) - 1
                    setattr(course, branch, new_count)
                    break
            
            db.session.commit()
            
        allocation_list.to_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/allocation_list.csv"), index=False)

        #returning prefernces list
        preference_list = Preference.query.order_by(Preference.roll_no ,Preference.pref_no).all()
        preference_object = [{
            'roll_no':pref.roll_no,
            'course_id':pref.course_id,
            'preference':pref.pref_no
        } for pref in preference_list]

        pref_df = pd.DataFrame(preference_object)

        pref_df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/preferences.csv"), index=False)
            
        return jsonify({'success':'allocation successful'}),200
    
@app.route('/approve_allocation', methods=['POST'])
@token_required
def approve_allocation(current_user,role):
    
    #check for valid user
    if role != 'admin':
        return jsonify({'error':'unauthorized access'}),401
    
    if len(Allocation.query.all()) != 0 :
        return jsonify({'error':'already approved'}),400


    try:
        allocation_df = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'],"Backup/allocation_list.csv"))
    except Exception as e:
        print(e)
        return jsonify({'error':'allocation list not found'}),404
    
    for index,row in allocation_df.iterrows():
        if row['course_id'] != 'Not Allocated':
            allocation = Allocation(roll_no=row['roll_no'], course_id=row['course_id'] + "-" + row['slot'])
            db.session.add(allocation)
            db.session.commit()
        
    return jsonify({'success':'allocation approved'}),200
    

@app.route('/student_allocation', methods=['GET'])
@token_required
def student_allocation(current_user,role):
    
    #check authorised user
    if role != 'student':
        return jsonify({'error':'unauthorized access'}),401
    
    #get student allocation
    allocation = Allocation.query.filter_by(roll_no=current_user.roll_no).first()
    if allocation is None:
        return jsonify({'error':'no allocation found'}),404
    else:
        allotted_course = utilities.course_dict(allocation.course)
    
    return jsonify({'allotted_course':allotted_course}),200

@app.route('/faculty_courses', methods=['GET'])
@token_required
def faculty_courses(current_user,role):
    
    #authorisation check
    if role != 'faculty' and role != 'fa':
        return jsonify({'error':'unauthorized access'}),401
    
    courses = Course.query.filter_by(faculty=current_user.email).all()
    course_list = [utilities.course_dict(course) for course in courses]
    
    return jsonify({'courses':course_list}),200


@app.route('/course_students', methods=['GET'])
@token_required
def course_students(current_user,role):
    
    #authorisation check
    if role != 'faculty' and role != 'fa':
        return jsonify({'error':'unauthorized access'}),401
    
    #get course id from reuest
    course = request.args.get("id")
    
    allocations = Allocation.query.filter_by(course_id=course).all()
    
    students_list = [utilities.student_dict(allocation.student) for allocation in allocations]
    
    return jsonify({'students':students_list}),200

@app.route('/fa_students', methods=['GET'])
@token_required
def fa_students(current_user,role):
    
    #authorisation check
    if role != 'fa':
        return jsonify({'error':'unauthorized access'}),401
    
    #get course id from request
    students = Student.query.filter_by(FA=current_user.email).all()

    students_list = []
    for student in students:
        allocation = Allocation.query.filter_by(roll_no = student.roll_no).first()
        if allocation is None:
            students_list.append({'roll_no':student.roll_no,
            'name':student.name,
            'email':student.email,
            'programme':student.programme,
            'semester':student.semester,
            'batch':student.batch,
            'course_id':'Not Allocated',
            'course_name':'Not Allocated',
            'slot':'Not Allocated'})
        else:
            students_list.append({'roll_no':allocation.student.roll_no,
            'name':allocation.student.name,
            'email':allocation.student.email,
            'programme':allocation.student.programme,
            'semester':allocation.student.semester, 
            'batch':allocation.student.batch, 
            'course_id':allocation.course.course_id.split('-')[0], 
            'course_name':allocation.course.name, 
            'slot':allocation.course.course_id.split('-')[1]})
    
    return jsonify({'students':students_list}),200

@app.route('/fa_download', methods=['GET'])
def fa_download():
    #get FA email from request
    FA_email = request.args.get('id')
    
    #make allocation list of students under advisorship
    students = Student.query.filter_by(FA=FA_email).all()

    students_list = []
    for student in students:
        allocation = Allocation.query.filter_by(roll_no = student.roll_no).first()
        if allocation is None:
            students_list.append({'roll_no':student.roll_no,
            'name':student.name,
            'email':student.email,
            'programme':student.programme,
            'semester':student.semester,
            'batch':student.batch,
            'course_id':'Not Allocated',
            'course_name':'Not Allocated',
            'slot':'Not Allocated'})
        else:
            students_list.append({'roll_no':allocation.student.roll_no,
            'name':allocation.student.name,
            'email':allocation.student.email,
            'programme':allocation.student.programme,
            'semester':allocation.student.semester, 
            'batch':allocation.student.batch, 
            'course_id':allocation.course.course_id.split('-')[0], 
            'course_name':allocation.course.name, 
            'slot':allocation.course.course_id.split('-')[1]})

    
    #creating FA download dataframe and file
    FA_df = pd.DataFrame(students_list, columns=["roll_no", "name", "email", "programme", "semester", "batch", "course_id", "course_name", "slot"])
    FA_df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'],f"fa_{FA_email}.csv"), index=False)
    
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'],f"fa_{FA_email}.csv"), as_attachment=True)

@app.route('/course_students_download', methods=['GET'])
def course_students_download():
    
    #get course id from request
    course = request.args.get('id')
    
    allocations = Allocation.query.filter_by(course_id=course).all()
    
    students_list = [utilities.student_dict(allocation.student) for allocation in allocations]
    
    course_list_df = pd.DataFrame(students_list, columns=["roll_no", "name", "semester", "batch", "programme", "email"])
    course_list_df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'],f"StudentList_{course}.csv"), index=False)

    return send_file(os.path.join(app.config['UPLOAD_FOLDER'],f"StudentList_{course}.csv"), as_attachment=True)

@app.route('/download_allocation', methods=['GET'])
def download_allocation():
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'],os.path.join('Backup','allocation_list.csv')), as_attachment=True)

@app.route('/download_random_list', methods=['GET'])
def download_random_list():
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'],os.path.join('Backup','random_list.csv')), as_attachment=True)

@app.route('/download_preference_list', methods=['GET'])
def download_preference_list():
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'],os.path.join('Backup','preferences.csv')), as_attachment=True)
