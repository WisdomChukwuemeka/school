from rest_framework import serializers
from .models import CourseRegistration, Notification, Student, Grade

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'student', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'student', 'is_read', 'message', 'created_at']
        


class StudentGradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='course.student.name', read_only=True)
    course_name = serializers.CharField(source='course.course_name', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student_name', 'course_name', 'grade', 'remark']



class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Grade
        fields = ['id', 'course', 'course_name', 'student_name', 'grade', 'remark', 'teacher']
        read_only_fields = ['id', 'teacher', 'student_name', 'course_name']
        
    def get_student_name(self, obj):
        student = obj.course.student
        return student.name or student.user.username
    
    def get_course_name(self, obj):
        return obj.course.course_name

class StudentCourseSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    class Meta:
        model = CourseRegistration
        fields = ['id', 'student_name', 'course_name', 'registered_at']
        
    def get_student_name(self, obj):
        return obj.student.name or obj.student.user.username
        

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name']
        read_only_fields = ['id']    

class CourseRegistrationSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = CourseRegistration
        fields = ['id', 'student', 'course_name', 'registered_at']
        read_only_fields = ['id', 'student', 'registered_at']

