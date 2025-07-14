import axios from 'axios'

const API_URL = 'http://localhost:8000/api'
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.reload()
        }
        return Promise.reject(error)
    }
)

export const AuthAPI = {
    admin: (adminData) => api.post('/adminpanel/', adminData),
    register: (formData) => api.post('/register/', formData),
    login: (credentials) => api.post('/login/', credentials),
    access_code: (codeData) => api.post('user/ACCeSS_code/', codeData),
    users: (search) => api.get(`/users/?search=${search}`),
    // allUsers: () => api.get('/users/'),
    delete: (id) => api.delete(`/delete/${id}/`),
}

export const CourseAPI = {
    register_name: (courseData) => api.post('/dashboard/', courseData),
    register_course: (registercourse) => api.post('/register_course/', registercourse),  
    getCourses: () => api.get('/register_course/'), 
    studentcourses: () => api.get('/studentcourses/'),
    grades: (addgrade) => api.post('/grades/', addgrade),
    gradesdata: () => api.get('/grades/'),
    studentgrade: () => api.get('/studentgrade/'),
    notification: () => api.get('/notifications/'),
    resetNotification: () => api.post('/reset-notification/'),
}


export default api