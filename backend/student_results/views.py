from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CourseRegistration, Student, Grade, Notification
from .serializers import CourseRegistrationSerializer, NotificationSerializer, StudentGradeSerializer, GradeSerializer, StudentSerializer, StudentCourseSerializer
from accounts.models import User
from rest_framework.exceptions import PermissionDenied

class StudentDashboardView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]  # Allow any user to view the dashboard

    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'You must be logged in to create a student record.'}, status=status.HTTP_401_UNAUTHORIZED)    
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response({
            'user': serializer.data,
            'message': 'Student record created successfully',
        }, status=status.HTTP_201_CREATED)

    def get(self):
        user = self.request.user
        if not user.is_authenticated:
            return Student.objects.filter(user=user)
        return Student.objects.none() 

class CourseRegistrationCreateView(generics.ListCreateAPIView):
    serializer_class = CourseRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"error": "You must be logged in to register for a course."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get the current student profile
        student = Student.objects.get(user=user)

        # Course name coming from the request body
        course_name = request.data.get("course_name")

        # 🚫 1. Prevent duplicate registration for this student + course (case‑insensitive)
        if CourseRegistration.objects.filter(
            student=student, course_name__iexact=course_name
        ).exists():
            return Response(
                {
                    "error": f"You have already registered for the course “{course_name}”."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ 2. Validate and save the new registration
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(student=student)

        return Response(
            {
                "user": serializer.data,
                "message": "Course registration successful",
            },
            status=status.HTTP_201_CREATED,
        )
        
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'You must be logged in to view course registrations.'}, status=401)
        student = Student.objects.get(user=user.id)
        registrations = CourseRegistration.objects.filter(student=student)
        serializer = self.get_serializer(registrations, many=True)
        return Response(serializer.data, status=200)

        
class StudentCourseView(generics.ListAPIView):
    serializer_class = StudentCourseSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated and user.is_staff:
            # Staff: get all students' information
            students = CourseRegistration.objects.all()
            serializer = self.get_serializer(students, many=True)
            return Response(serializer.data, status=200)
        return Response({'error': 'Authentication required.'}, status=401)
    
class GradeView(generics.ListCreateAPIView):
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Only teachers can assign grades")
        course = serializer.validated_data.get('course')
        student = course.student
        if Grade.objects.filter(course=course).exists():
            raise PermissionDenied("Grade for this student and course has already been assigned")
        grade_instance = serializer.save(teacher=self.request.user)
        notification_count = Notification.objects.filter(student=student).count() + 1
        student = grade_instance.course.student
        Notification.objects.create(
            student=student,
            message=str(notification_count),
        )
        return Response({
            'message': 'Grade uploaded successfully'
        }, status=status.HTTP_202_ACCEPTED)
        
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Grade.objects.all()
        try:
            student = Student.objects.get(user=user)
        except Student.DoesNotExist:
            return Grade.objects.none()
        return Grade.objects.filter(course_student=student)
    
        
class StudentGradeView(generics.ListAPIView):
    serializer_class = StudentGradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'You must be logged in to view your grades.'}, status=401)
        
        try:
            student = Student.objects.get(user=user)
        except Student.DoesNotExist:
            return Response({'error': 'Student record not found.'}, status=404)

        grades = Grade.objects.filter(course__student=student)
        serializer = self.get_serializer(grades, many=True)
        return Response(serializer.data, status=200)
    
    
class StudentNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
            unread_notifications = Notification.objects.filter(student=student, is_read=False)
            count = unread_notifications.count()
            latest_notification = unread_notifications.first()

            if latest_notification:
                return Response({
                    "count": count,
                    "message": latest_notification.message,
                    "is_read": False
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "count": 0,
                    "message": "No new notifications",
                    "is_read": True
                }, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        
        
class ResetNotificationView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        try:
            student = Student.objects.get(user=request.user)
            Notification.objects.filter(student=student, is_read=False).update(is_read=True)
            return Response({
                "message": "Notifications marked as read",
                "count": 0,
                "is_read": True
            }, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

                    
        


    
