// src/pages/RegisterPage.jsx
import { useState } from "react";
import axios from 'axios'
import {useNavigate, Link} from "react-router-dom"



export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData(prevData => ({
        ...prevData,
        [e.target.name]: e.target.value
    }))
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
      const response = await axios.post(`http://localhost:8000/api/login/`, formData)
      setSuccess(response.data.message)
      if(response.status === 200 && response.data.access){
                localStorage.setItem('token', response.data.access)
                localStorage.setItem("role", response.data.role)
            }
      if(response.data.role === "student"){
        navigate('/studentdashboard')
      }else if(response.data.role === "staff"){
        navigate('/teachersdashboard')
      }
      setTimeout(() => setSuccess(''), 2000);
    } catch(error){
      setError("Login failed.")
      setTimeout(() => setError(''), 2000);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {success && <div className="text-green-600 text-center">{success}</div>}
        {error && (
          <div className="text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-[-1rem]">
        <Link to="/register">
          Don't have an account? <span className="text-blue-700">Signup</span>
        </Link>
      </div>
      </div>
    </div>
  );
};


