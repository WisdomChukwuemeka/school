import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CourseAPI } from "../services/api";

export const StudentDashboard = () => {

  const [courseData, setCourseData] = useState({ name: "" });
  const [registerCourse, setRegisterCourse] = useState({ course_name: "" });
  const [courses, setCourses] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [courseAdded, setCourseAdded] = useState(0); // ✅ add this
 
  // Handle name change
  const handleNameChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  // Handle course input change
  const handleCourseChange = (e) => {
    setRegisterCourse({ ...registerCourse, [e.target.name]: e.target.value });
  };

  // Submit student name
  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const response = await CourseAPI.register_name(courseData);
      setSuccess(response.data?.message?.[0]);
      setCourseData({ name: "" });
      setTimeout(() => setSuccess(""), 3000);
      alert("Name added successfully!");
    } catch (err) {
      setError(
        err.response?.data?.name?.[0] ||
        err.response?.data?.error ||
        "Failed to add name"
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Submit course
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoadingCourse(true);

    try {
      const response = await CourseAPI.register_course(registerCourse);
      setSuccess('registered successfully');
      setRegisterCourse({ course_name: "" });
      setCourseAdded((prev) => prev + 1)
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.name?.[0] ||
        err.response?.data?.error ||
        "Failed to register course"
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoadingCourse(false);
    }
  };

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CourseAPI.getCourses();
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.error?.[0] || "Error fetching courses");
        setTimeout(() => setError(""), 3000);
      }
    };

    fetchCourses();
  }, [courseAdded]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Top Navigation */}
      <div className="flex justify-between items-center bg-white p-4 shadow rounded">
        <h1 className="text-xl font-bold text-blue-700">Student Dashboard</h1>
        <h2 className="text-blue-600 hover:underline">
          <Link to="/studentresult">
          View result</Link>
          </h2>

        <Link to="/videocall">
          <div class="text-blue-700 text-center"><i class="bi bi-camera-reels"></i><p>Go Live</p></div>
        </Link>
    
        <Link to="/profile" className="text-blue-600 hover:underline">
          View Profile
        </Link>
      </div>

      {/* Alerts */}
      {success && <div className="text-green-600 font-medium">{success}</div>}
      {error && <div className="text-red-600 font-medium">{error}</div>}

      {/* Name Registration Form */}
      <form
        onSubmit={handleNameSubmit}
        className="bg-white p-6 shadow rounded space-y-4"
      >
        <h2 className="text-lg font-semibold">Register Student Name</h2>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          value={courseData.name}
          onChange={handleNameChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Name"}
        </button>
      </form>

      {/* Course Registration Form */}
      <form
        onSubmit={handleCourseSubmit}
        className="bg-white p-6 shadow rounded space-y-4"
      >
        <h2 className="text-lg font-semibold">Register Course</h2>
        <input
          type="text"
          name="course_name"
          placeholder="Enter course name"
          value={registerCourse.course_name}
          onChange={handleCourseChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loadingCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loadingCourse ? "Registering..." : "Register Course"}
        </button>
      </form>

      {/* Registered Courses List */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Registered Courses</h2>
        {courses.length > 0 ? (
          <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-2">
            {courses.map((course, index) => (
              <li key={index} className="text-gray-700">
                {course.course_name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No courses registered yet.</p>
        )}
      </div>
    </div>
  );
};
