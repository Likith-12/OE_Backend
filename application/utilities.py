#imports
import random
import os
from application.models import Faculty

#function to convert student object to dictionary
def student_dict(student):
    student_dict =  {column.name: str(getattr(student, column.name)) for column in student.__table__.columns}
    faculty = Faculty.query.filter_by(email=student_dict['FA']).first()
    if faculty is not None:
        student_dict["FA"] = faculty.name
    return student_dict

#function to convert student object to dictionary
def course_dict(course):
    course =  {column.name: str(getattr(course, column.name)) for column in course.__table__.columns}
    course['id'] = course['course_id']
    course['slot'] = course['course_id'].split('-')[1]
    course['course_id'] = course['course_id'].split('-')[0]
    return course

#function to convert faculty object to dictionary
def faculty_dict(faculty):
    return {column.name: str(getattr(faculty, column.name)) for column in faculty.__table__.columns}

#function to obtain unique objects in list
def findUniqueElements(studentList):
    # using dictionary for hashing
    uniqueElementsDict = {}
    # traversing the entire studentList and adding the elements to the dictionary
    for student in studentList:
        uniqueElementsDict[student]=1
    
    # taking only the keys from the dictionary
    uniqueElements=list(uniqueElementsDict.keys())
    return uniqueElements

#function to generate random list
def random_shuffle(student_list):
    #zero length check
    if len(student_list) == 0:
        return student_list
    
    # bound indices
    first, last = 0, len(student_list)-1

    # if length of array is 1 no need to continue
    if first != last:
        # assigning current index as 0
        index = 0
        # iterating through the entire array, shuffling it at the same time
        for index in range(len(student_list)):
            # selecting a random index from 0 to i and swapping the elements at these 2 positions
            index1 = first + random.randint(0, index)
            # if both indexes are different then we swap them
            if index != index1:
                student_list[index], student_list[index1] = student_list[index1], student_list[index]
    
    return student_list

def delete_csv(directory_path):
    # iterate over all the files in the directory
    for filename in os.listdir(directory_path):
        # check if the file is a CSV file
        if filename.endswith(".csv"):
            # create the full file path by joining the directory path and file name
            file_path = os.path.join(directory_path, filename)
            # delete the file
            os.remove(file_path)
