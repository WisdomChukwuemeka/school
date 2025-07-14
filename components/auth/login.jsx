// src/pages/RegisterPage.jsx
import { useState } from "react";
import axios from 'axios'
import {useNavigate, Link} from "react-router-dom"
import { AuthAPI } from "../services/api";



export const Login = (onLogin) => {
  const navigate = useNavigate();
  const [credentials, setcredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setcredentials(prevData => ({
        ...prevData,
        [e.target.name]: e.target.value
    }))
  };

  
  const handleSubmit = async(e) => {
    e.preventDefault()
    setSuccess('')
    setError('')
    setLoading(true)
    try{
      const response = await AuthAPI.login(credentials)
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('role', response.data.role)
      localStorage.setItem('is_superuser', JSON.stringify(response.data.user.is_superuser))
      setSuccess(response.data.message)
      setTimeout(() => setSuccess(''), 2000)
      const role = localStorage.getItem('role')
      const is_superuser = JSON.parse(localStorage.getItem('is_superuser'))
      if (role === 'staff'){
        navigate('/teachersdashboard')
      } else if(role === 'student'){
        navigate('/studentdashboard')
      } else if(role === 'manager'){
        navigate('/manager')
      } else if(is_superuser){
        navigate('/admin')
      } else if(role === 'visitor'){
        navigate('/')
      }
      onLogin(response.data.user)
    } catch(error){
      setError(
        error.response?.data?.email?.[0] ||
      error.response?.data?.password?.[0]
      ) 
    }finally{
      setLoading(false)
    }
  }

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
              value={credentials.email}
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
              value={credentials.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Login...' : 'Login'}
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


