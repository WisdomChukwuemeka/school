import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

export const TeachersDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccess = async () => {

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}`, {}, {
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
        });
        setLoading(false);
      } catch (error) {
        // Try to refresh the access token
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          });
          localStorage.setItem("token", response.data.access);
          setLoading(false);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      }
    };

    verifyAccess();
  }, [navigate]);

  

  return (
    <>
        <div className="min-h-screen bg-gray-100 p-6">
        
        <div><Link to='/profile'>Profile</Link></div>
        

     </div>
    </>

  );
};

// Tab Components
