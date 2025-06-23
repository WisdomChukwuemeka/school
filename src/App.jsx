import { Registration } from "../auth/registration"
import { Login } from "../auth/login"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { StudentDashboard } from "../dashboard/studentdashboard"
import { TeachersDashboard } from "../dashboard/teachersdashboard"
import { ProtectedRoute } from "../auth/protectroute"
import { Layout } from "../components/layout"
import { Home } from "../pages/home"
import { Profile } from "../components/profile"
export const App = () => {
  return(
    <>
      <div>
        
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
          <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route index element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/teachersdashboard" element={<ProtectedRoute><TeachersDashboard/></ProtectedRoute>} />
        <Route path='/profile' element={<Profile />} />
        
        </Route>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}