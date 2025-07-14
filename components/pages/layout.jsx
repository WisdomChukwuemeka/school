import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { ProfileApi } from "../services/apitwo";
import { useLocation } from "react-router-dom";
import { CourseAPI } from "../services/api";

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null); // Changed from [] to null for better debugging
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(true);
  const [showdashboard, setShowDashboard] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [notification, setNotification] = useState([]);
  const [update, setUpdate] = useState([]);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const is_superuser = localStorage.getItem("is_superuser") === "true";
    if (["manager", "staff", "student", "visitor"].includes(userRole)) {
      setShowDashboard(true);
      setRole(userRole);
    } else if (is_superuser) {
      setShowDashboard(true);
      setRole("is_superuser");
    }
  }, [location.pathname]);

  const Menubar = () => {
    setMenu(!menu);
  };

  const Logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("code");
    localStorage.removeItem("is_superuser");
    navigate("/login");
  };

  const handleNotificationClick = async () => {
    try {
      const response = await CourseAPI.resetNotification();
      console.log(response.data);
      setNotification(response.data.count);
      navigate("/studentresult");
    } catch (error) {
      console.error("Failed to reset notification:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const userRole = localStorage.getItem("role");
      if (userRole === "student") {
        try {
          const response = await CourseAPI.notification();
          if (response.data.is_read != true) {
            setNotification(response.data.count);
          } else if (response.data.is_read != false) {
            setNotification(response.data.count);
          }
          console.log(response.data);
        } catch (error) {
          console.error("Notification fetch failed:", error);
          setError("Notification fetch failed");
        }
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // In your Layout component's useEffect:
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await ProfileApi.profileDetails();
      setProfile(response.data.profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setError("Could not load profile.");
    }
  };

  fetchProfile();
}, []);


  const refreshProfile = async () => {
  try {
    const response = await ProfileApi.profileDetails();
    setProfile(response.data.profile);
    console.log(response.data.profile)
    console.log("Profile refreshed:", response.data.profile);
  } catch (error) {
    console.error("Profile refresh failed:", error);
  }
};


  return (
    <>
      <div className="relative">
        <header className="bg-gradient-to-r from-red-900 via-purple-950 to-black w-full h-fit p-4 text-white lg:text-3xl shadow-md shadow-gray-500">
          <nav className="flex items-center justify-between">
            <h2 className="italic text-white">CELIA'S ACADEMY</h2>

            <ul className="md:flex gap-10 hidden">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>About</li>
              <li>Metro</li>
              <li>contact</li>
              
              {showdashboard && role === "is_superuser" && (
                <div className="flex items-center gap-2">
                  <li>
                    <Link to={`/admin`}>Dashboard</Link>
                  </li>
                </div>
              )}
              
              {showdashboard && role === "manager" && (
                <div className="flex items-center gap-2">
                  <li>
                    <Link to={`/manager`}>Dashboard</Link>
                  </li>
                </div>
              )}
              
              {showdashboard && role === "staff" && (
                <div className="flex items-center gap-2">
                  <li>
                    <Link to={`/teachersdashboard`}>Dashboard</Link>
                  </li>
                </div>
              )}
              
              {showdashboard && role === "student" && (
                <div className="flex items-center gap-2">
                  <li>
                    <Link to={`/studentdashboard`}>Dashboard</Link>
                  </li>
                </div>
              )}

              {!showdashboard && role === "visitor" && (
                <div className="flex items-center gap-2">
                  <li>
                    <Link to={`/`}>Dashboard</Link>
                  </li>
                </div>
              )}

              {showdashboard && role === "student" && (
                <div
                  onClick={handleNotificationClick}
                  className="cursor-pointer relative flex items-center"
                >
                  <i className="bi bi-bell-fill text-xl text-white"></i>
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 h-5 flex items-center justify-center">
                    {notification}
                  </span>
                </div>
              )}


              {showdashboard && role === "student" && (
  <div className="flex items-center gap-2">
    {profile?.avatar ? (
      <img
        src={`http://localhost:8000/api${profile.avatar}`}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white shadow-md flex items-center justify-center">
        <i className="bi bi-person-fill text-white"></i>
      </div>
    )}
  </div>
)}

            </ul>

            <div className="flex gap-4 items-center">
              <div className="md:hidden" onClick={Menubar}>
                {menu ? <i className="bi bi-list"></i> : <i className="bi bi-x-lg"></i>}
              </div>
              <div
                onClick={Logout}
                className="hidden md:flex bg-blue-300 text-white p-1.5 rounded h-fit w-fit hover:bg-white duration-500 hover:text-black"
              >
                Logout
              </div>
            </div>
          </nav>
        </header>
        
        <div>
          <AnimatePresence>
            {!menu ? (
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: [400, 0] }}
                exit={{ x: [0, 400] }}
                transition={{ duration: 0.5 }}
                className="absolute z-10 right-0 bg-red-900 text-white h-fit w-[50%] rounded-bl-4xl md:hidden lg:hidden"
              >
                <ul className="flex gap-7 flex-col p-4 items-center">
                  <div className="hover:bg-white w-full hover:text-black text-center duration-1000">
                    <Link to="/">Home</Link>
                  </div>
                  <div className="hover:bg-white w-full hover:text-black text-center duration-1000">
                    <li>About</li>
                  </div>
                  <div className="hover:bg-white w-full hover:text-black text-center duration-1000">
                    <li>Metro</li>
                  </div>
                  
                  {showdashboard && role === "is_superuser" && (
                    <div className="flex items-center gap-2">
                      <li>
                        <Link to={`/admin`}>Dashboard</Link>
                      </li>
                    </div>
                  )}
                  
                  {showdashboard && role === "manager" && (
                    <div className="flex items-center gap-2">
                      <li>
                        <Link to={`/manager`}>Dashboard</Link>
                      </li>
                    </div>
                  )}
                  
                  {showdashboard && role === "staff" && (
                    <div className="flex items-center gap-2">
                      <li>
                        <Link to={`/teachersdashboard`}>Dashboard</Link>
                      </li>
                    </div>
                  )}
                  
                  {showdashboard && role === "student" && (
                    <div className="flex items-center gap-2">
                      <li>
                        <Link to={`/studentdashboard`}>Dashboard</Link>
                      </li>
                    </div>
                  )}

                  {!showdashboard && role === "visitor" && (
                    <div className="flex items-center gap-2">
                      <li>
                        <Link to={`/`}>Dashboard</Link>
                      </li>
                    </div>
                  )}
                  
                  <div className="hover:bg-white w-full hover:text-black text-center duration-1000">
                    <li>contact</li>
                  </div>
                  <div
                    onClick={Logout}
                    className="hover:bg-white w-full hover:text-black text-center duration-1000"
                  >
                    Logout
                  </div>
                </ul>
              </motion.div>
            ) : (
              ""
            )}
          </AnimatePresence>
        </div>
      </div>
      <main>
        <Outlet context={{ refreshProfile }} />
      </main>
    </>
  );
};