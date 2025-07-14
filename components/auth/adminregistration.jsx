// src/pages/RegisterPage.jsx
import { useState } from "react";
import {useNavigate, Link} from "react-router-dom"
import {AuthAPI} from "../services/api";

export const AdminRegistration = ({onRegister}) => {
  const navigate = useNavigate()
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setAdminData(prevData => ({
        ...prevData,
        [e.target.name]: e.target.value
    }))
  };
  const handleCheckboxChange = (e) => {
  setAdminData(prevData => ({
    ...prevData,
    [e.target.name]: e.target.checked
  }));
};

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const response = await AuthAPI.admin(adminData)
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(response.data.user.is_superuser))
      setSuccess(response?.data?.message)
      setTimeout(() => setSuccess(''), 2000);
      navigate('/login')
      onRegister(response.data.user)
    } catch(error){
      setError(
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.confirm_password?.[0] || 'Registration failed, try again')
      setTimeout(() => setError(''), 2000);
    } finally {
      setLoading(false)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

        {success && <div className="text-green-600 text-center">{success}</div>}
        {error && (
          <div className="text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={adminData.first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Lugard doe"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={adminData.last_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Lugard doe"
            />
          </div>
          </div>
          

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={adminData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Lugard doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={adminData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              value={adminData.phone_number}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="+234"
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
              value={adminData.password}
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
            {loading ? 'Registering...' : 'Register' }
          </button>
        </form>

        <div className="text-center mt-[-1rem]">
        <Link to="/login">
          Already have an account? <span className="text-blue-700">Login</span>
        </Link>
      </div>
      </div>
    </div>
  );
};


