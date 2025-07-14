import { createContext, useState, useEffect } from "react";
import { AuthAPI } from "../components/services/api";
export const DataContext = createContext();


export const DataProvider = ({children}) => {
    const [searchUser, setSearchUser] = useState('');
    const [Users, setUsers] = useState([]);
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [codeData, setcodeData] = useState({
    code: '',
    role: '',
  });
    const [activeView, setActiveView] = useState('users'); // 'users' or 'access_code'
    const [responseData, setResponseData] = useState(null);
    const handleSearchChange = (e) => {
        setSearchUser(e.target.value.toLowerCase());
    }

    
    const deleteButton = async(user) => {
        if(!user || !user.id) {
            setError('Invalid user data');
            setTimeout(() => setError(''), 3000);
            return;
        }
        try{
            const response = await AuthAPI.delete(user.id);
            setSuccess(response.data.message || 'User deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
            console.log(response.data)
            await searchButton();
        } catch(error){
            setError(
             'Unable to delete user'
            )
            setTimeout(() => setError(''), 3000)
        }
    }

    const searchButton = async (e) => {
        if (e) e.preventDefault();
        try {
            const response = await AuthAPI.users(searchUser);
            setUsers(response.data.users)
            setActiveView('search');
        } catch (error) {
            setError(

            )
        }
    }
    const handleChange = (e) => {
    setcodeData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Simulated API request: Replace with your actual API call
      const response = await AuthAPI.access_code(codeData);
      setResponseData(response);
      setActiveView('access_code');
      onCode(response.data.code);
    } catch (err) {
      setError(response.data?.status?.[0]);
    }
  };


    useEffect(() => {
      searchButton();
    },[])
    return(
        <>
            <DataContext.Provider value={{searchButton, 
              activeView, setActiveView, codeData, 
              responseData, handleChange, handleSubmit, 
              searchUser, handleSearchChange, Users, 
              deleteButton, success, error}}>
                {children}
            </DataContext.Provider>
        </>
    )
}