import { useState, useEffect } from "react";
import { CourseAPI } from "../services/api";
export const TeachersDashboard = () => {
const [groupedCourses, setGroupedCourses] = useState({});
const [success, setSuccess] = useState('')
const [error, setError] = useState('')
const [addgrade, setAddGrade] = useState({
  course: '',
  grade: '',
  remark: '',
})
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)

const handlecourseChange = (e) => {
    setAddGrade(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

const gradeSubmit = async(e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      const response = await CourseAPI.grades(addgrade);
      setSuccess(response.data?.message?.[0]); // Set success message
      setAddGrade({ course_name: "" }); // Reset course data
      setTimeout(() => setSuccess(''), 2000); // Clear success message after 2 seconds
       // Clear the input field after submission
    } catch (error) {
      setError(
        error.response?.data?.name?.[0] ||
        error.response?.data?.error
      ); // Set error message
      setTimeout(() => setError(''), 2000); // Clear error after 2 seconds
    } finally{
      setLoading(false); // Reset loading state
    }
  }

  // ✅ Helper function to remove duplicate student names
  const groupByStudent = (data) =>
    data.reduce((acc, item) => {
      if (!acc[item.student_name]) {
        acc[item.student_name] = new Map();
      }
      acc[item.student_name].set(item.course_name, item);
      return acc;
    }, {});

useEffect(() => {
  const course = async() => {
    try{
          const response = await CourseAPI.studentcourses()
          const uniquenames = groupByStudent(response.data)
    setGroupedCourses(uniquenames)
    console.log("unique course:", uniquenames)

    } catch(error){
      setError("Courses unavailable at this time.")
    }
  }
  course();
}, [])

const getResult = async() => {
try{
    const response = await CourseAPI.gradesdata()
    console.log(response.data)
    setData(response.data)
    } catch(error){
      setError(
        'Unble to generate result at this moment'
      )
    }
  }

  
  return (
    <>
        <div>Teacher dashboard</div>
        <div className="overflow-x-auto mt-4">
  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
    <thead className="bg-gray-100 text-left">
      <tr>
        <th className="py-2 px-4 border-b">#</th>
        <th className="py-2 px-4 border-b">Student Name</th>
        <th className="py-2 px-4 border-b">Course Name</th>
        <th className="py-2 px-4 border-b">Registered at</th>
      </tr>
    </thead>
    <tbody>
  {Object.entries(groupedCourses).map(([studentName, courseMap], studentIndex) => {
    // Convert courseMap (Map) to an array
    const coursesArray = Array.from(courseMap.values());

    return coursesArray.map((course, courseIndex) => (
      <tr key={`${studentName}-${course.course_name}`} className="hover:bg-gray-50">
        <td className="py-2 px-4 border-b">{studentIndex + 1}.{courseIndex + 1}</td>

        {/* Show student name only for the first row */}
        <td className="py-2 px-4 border-b">
          {courseIndex === 0 ? studentName : ""}
        </td>

        <td className="py-2 px-4 border-b">{course.course_name}</td>
        <td className="py-2 px-4 border-b">{course.registered_at}</td>
      </tr>
    ));
  })}
</tbody>

  </table>
</div>

<section className="mt-6">
  <h2 className="text-lg font-semibold mb-2">Student Results</h2>
  {data.length > 0 ? (
    <div>
      {data.map((item) => (
        <div key={item.id} className="mb-4 border-b pb-2">
          <h2 className="font-bold">Name: {item.student_name}</h2>
          <div className="text-blue-600">Grade: {item.grade}</div>
          <div className="text-green-600">Remark: {item.remark}</div>
          <p className="text-gray-700">Course: {item.course_name}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 italic">No results found.</p>
  )}
</section>


<section>
  {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
  <div>
  <form onSubmit={gradeSubmit} className="p-4 shadow rounded bg-white">
      <h2 className="text-lg font-semibold mb-2">Add grade</h2>
      <select
  name="course"
  value={addgrade.course}
  onChange={handlecourseChange}
  className="border px-2 py-1 w-full mb-2"
>
  <option value="">Select Student Course</option>
  {Object.entries(groupedCourses).map(([studentName, courseMap]) =>
    Array.from(courseMap.values()).map((course) => (
      <option key={course.id} value={course.id}>
        {studentName} - {course.course_name}
      </option>
    ))
  )}
</select>
      <input
        type="text"
        name="grade"
        placeholder="Enter Grade"
        value={addgrade.grade}
        onChange={handlecourseChange}
        className="border px-2 py-1 w-full mb-2"
      />
      <input
        type="text"
        name="remark"
        placeholder="Enter Remark"
        value={addgrade.remark}
        onChange={handlecourseChange}
        className="border px-2 py-1 w-full mb-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded"
        disabled={loading}>
        {loading ? "Adding..." : "Add Grade"}
      </button>
    </form>
  </div>

  <div class='bg-green-700 w-fit h-fit text-white p-2 rounded' onClick={getResult}>
  View result
</div>
</section>


    </>

  );
};
