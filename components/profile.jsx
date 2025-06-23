import { useState } from "react"
import axios from 'axios'

export const Profile = () => {
    const [profileData, setProfileData] = useState({
        avatar: null,
        bio: "",
    })
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setProfileData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.name === "avatar" ? e.target.files[0] : e.target.value,
        }))
    }

    const avatarprofile = async (e) => {
        e.preventDefault()
        
        // Check if token exists
        const token = localStorage.getItem('token')
        if (!token) {
            setError("No authentication token found. Please login first.")
            setTimeout(() => setError(""), 5000)
            return
        }

        // Create FormData inside the submit function
        const formData = new FormData()
        formData.append("avatar", profileData.avatar)
        formData.append("bio", profileData.bio)

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/profile/`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(token)}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            setSuccess(response.data.message)
            setTimeout(() => setSuccess(""), 5000)
            console.log(response.data.message)

        } catch (error) {
            console.error('Error details:', error.response?.data)
            
            if (error.response?.status === 401) {
                setError("Unauthorized. Please check your login credentials.")
            } else if (error.response?.status === 403) {
                setError("Access forbidden. You don't have permission to perform this action.")
            } else {
                setError(error.response?.data?.message || "Failed to upload profile")
            }
            setTimeout(() => setError(""), 5000)
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
                <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Profile</h2>

                    {success && <div className="text-green-600 text-center">{success}</div>}
                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={avatarprofile} className="space-y-4">
                        <div>
                            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                                Avatar
                            </label>
                            <input 
                                type="file" 
                                name="avatar" 
                                id="avatar" 
                                accept="image/*"
                                onChange={handleChange} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea 
                                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                name="bio" 
                                id="bio" 
                                value={profileData.bio} 
                                onChange={handleChange} 
                                placeholder="Create bio"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}