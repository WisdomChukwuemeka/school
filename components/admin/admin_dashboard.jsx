import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AccessCode } from "./accesscode";
import { DataContext } from "../../context/context";
import { Link } from "react-router-dom";

export const Admin = () => {
  const {
    searchButton,
    searchUser,
    error,
    handleSearchChange,
    Users,
    deleteButton,
    success,
    codeData,
    responseData,
    handleChange,
    handleSubmit,
    activeView,
    setActiveView
  } = useContext(DataContext);

  const handleDelete = (user) => {
    deleteButton(user);
  };

  return (
    <div className="min-h-screen p-2 bg-gray-100 text-gray-800">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

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

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="bg-white p-4 rounded shadow-lg mb-6 w-full md:w-[250px] flex flex-col justify-center items-center">
            <div className="flex relative w-full">
              <input
                className="bg-gray-200 border text-[1rem] rounded-full w-full h-7 pr-8 pl-3"
                type="search"
                name="searchUser"
                id="searchUser"
                value={searchUser}
                onChange={handleSearchChange}
                placeholder="Search users by role"
              />
              <div
                onClick={() => {
                  searchButton();
                  setActiveView("search");
                }}
                className="absolute right-2 top-1 border-0 bg-gray-200 rounded-r-2xl h-5 w-5 flex items-center justify-center cursor-pointer"
              >
                <i className="bi bi-search text-sm"></i>
              </div>
            </div>
            <div><h2 className="text-1 font-semibold mb-4 mt-4">Tasks</h2></div>
            <div><h2 className="text-l font-semibold mb-4">Users</h2></div>
            <div><h2 className="text-l font-semibold mb-4">Result</h2></div>
            <div><h2 className="text-l font-semibold mb-4">Code analysis</h2></div>
            <div><h2 className="text-l font-semibold mb-4">Complaints</h2></div>
            <div><h2 className="text-l font-semibold mb-4">Posts</h2></div>
            <div onClick={() => setActiveView("access_code")} className="cursor-pointer">
              <h2 className="text-l font-semibold mb-4">Create code</h2>
            </div>
            <Link to="/admindashboard">
              <div><h2 className="text-l font-semibold mb-4">Track activities</h2></div>
            </Link>
          </div>

          {/* Main View Section */}
          <div className="flex-1">
            {activeView === "search" && (
              Users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-fit">
                  {Users.map((user) => (
                    <div
                      className="shadow-lg bg-white p-3 rounded flex flex-col justify-between h-fit w-fit"
                      key={user.id}
                    >
                      <div>
                        <h3><strong>First name:</strong> {user.first_name}</h3>
                        <h3><strong>Last name:</strong> {user.last_name}</h3>
                        <h3><strong>Email:</strong> {user.email}</h3>
                        <h3><strong>Role:</strong> {user.role}</h3>
                        <h3><strong>Active:</strong> {user.is_active ? "Active" : "Inactive"}</h3>
                      </div>
                      <div className="mt-2">
                        <div
                          onClick={() => handleDelete(user)}
                          className="bg-red-700 w-full text-center text-white p-1 rounded cursor-pointer hover:bg-red-800 transition"
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No users found.</p>
              )
            )}

            {activeView === "access_code" && (
              <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Access Code</h2>

                {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}
                {responseData && (
                  <div className="bg-green-100 p-3 rounded-md mb-4">
                    <p className="text-green-800">✅ Access code created successfully.</p>
                    <p><strong>Code:</strong> {responseData.code}</p>
                    <p><strong>Role:</strong> {responseData.role}</p>
                    <p><strong>Used:</strong> {responseData.is_used ? 'Yes' : 'No'}</p>
                    <p><strong>Created At:</strong> {new Date(responseData.created_at).toLocaleString()}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Access Code</label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={codeData.code}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. ABC123"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
                    <select
                      id="role"
                      name="role"
                      value={codeData.role}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Select Role --</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-150"
                  >
                    Create Code
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
