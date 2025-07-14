import { useState } from "react"
import { ProfileApi } from "../services/apitwo"

export const Profile = ({ onProfile }) => {
    const [profileData, setProfileData] = useState({
        avatar: null,
    })
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null) // Add preview state

    const handleChange = (e) => {
        if (e.target.name === 'avatar') {
            const file = e.target.files[0]
            setProfileData(prevData => ({
                ...prevData,
                avatar: file,
            }))
            
            // Create preview URL for immediate display
            if (file) {
                const url = URL.createObjectURL(file)
                setPreviewUrl(url)
            }
        } 
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        setError('') // Clear previous errors
        
        try{
            const formData = new FormData();
            formData.append('avatar', profileData.avatar);

            const response = await ProfileApi.profile(formData)
            setSuccess(response.data.message)
            setTimeout(() => setSuccess(''), 2000)
            
            // Update parent component with new profile data
            onProfile(response.data.profile)
            
            // Update local state with the response data if available
        } catch(error) {
            setError(
                error.response?.data?.avatar?.[0])
        } finally {
            setLoading(false)
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

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            
                            {/* Preview selected image */}
                            {previewUrl && (
                                <div className="mt-2">
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit" 
                            disabled={loading}
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}