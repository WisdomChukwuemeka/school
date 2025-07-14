import { Registration } from "../components/auth/registration"
import { Login } from "../components/auth/login"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { StudentDashboard } from "../components/dashboard/studentdashboard"
import { TeachersDashboard } from "../components/dashboard/teachersdashboard"
import { ProtectedRoute } from "../components/auth/protectroute"
import { Layout } from "../components/pages/layout"
import { Home } from "../components/pages/home"
import { Profile } from "../components/pages/profile"
import { Admin } from "../components/admin/admin_dashboard"
import { Manager } from "../components/dashboard/managerdashboard"
import { AdminDashboard } from "../components/admin/admin2"
import { AccessCode } from "../components/admin/accesscode"
import { Footer } from "../components/pages/footer"
import { Results } from "../components/dashboard/student_dashboard/student_result"
import { Videocall } from "../components/dashboard/student_dashboard/live"


export const App = () => {
  return (
    <div className="2xl:container 2xl:mx-auto flex flex-col min-h-screen bg-gray-100 w-full overflow-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route index element={<Home />} />
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route path="/teachersdashboard" element={<TeachersDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/accesscode" element={<AccessCode />} />
            <Route path="/studentresult" element={<Results />} />
            <Route path="/videocall" element={<Videocall />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Footer will always be at the bottom, no space beneath */}
      <div className="mt-auto bg-gray-800 text-white py-4 text-center w-full">
        <Footer />
      </div>
    </div>
  );
};
