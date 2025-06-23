// src/pages/RegisterPage.jsx
import { useState } from "react";
import axios from 'axios'
import {useNavigation, Link} from "react-router-dom"


export const Registration = () => {
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    role: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    agreement: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setFormData(prevData => ({
        ...prevData,
        [e.target.name]: e.target.value
    }))
  };
  const handleCheckboxChange = (e) => {
  setFormData(prevData => ({
    ...prevData,
    [e.target.name]: e.target.checked
  }));
};

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
      const response = await axios.post(`http://localhost:8000/api/register/`, formData)
      setSuccess(response.data.message)
      setTimeout(() => setSuccess(''), 2000);
      localStorage.setItem('token', response.data.access)
    } catch(error){
      setError("Registration failed.")
      setTimeout(() => setError(''), 2000);
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
              value={formData.first_name}
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
              value={formData.last_name}
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
              value={formData.username}
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
              value={formData.email}
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
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="+234"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="staff">Teacher</option>
            </select>
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
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          

          <div className="flex gap-2 items-center">
            <input type="checkbox" name="agreement" id="agreement" 
            checked={formData.agreement}
            onChange={handleCheckboxChange}
            required
            />
            <label htmlFor="agreement" className="block text-sm font-medium text-gray-700">
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
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


