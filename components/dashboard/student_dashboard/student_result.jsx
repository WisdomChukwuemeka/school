import { useState, useEffect } from "react";
import { CourseAPI } from "../../services/api";

export const Results = () => {
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResult = async () => {
      try {
        const response = await CourseAPI.studentgrade();
        console.log("Grades fetched:", response.data);
        setResult(response.data);
      } catch (error) {
        setError(
          error?.response?.data?.error ||
            "Unable to generate result at this moment"
        );
        console.log(error?.response?.data?.error?.[0])
      } finally {
        setLoading(false);
      }
    }
    getResult()
  }, []);

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div class="flex justify-betweeny">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Student Result
      </h1>

      <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Print Result
        </button>
      </div>
      
      

      <section className="bg-white p-6 shadow-md rounded-md">
        {loading && <p className="text-gray-500 italic">Loading results...</p>}

        {error && (
          <p className="text-red-600 font-semibold mb-4">{error}</p>
        )}

        {result.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded p-4 shadow-sm"
              >

                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Course:</span>{" "}
                  {item.course_name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Grade:</span>{" "}
                  {item.grade}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Remark:</span>{" "}
                  {item.remark}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
