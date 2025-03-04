import React, {createContext,useState,useEffect} from "react";

export const AuthContext = createContext();

const AuthProvider = ({children}) =>
{
    const [user,setUser] = useState(null);
    const login = (userData) =>
    {
        setUser(userData);
        localStorage.setItem("user",JSON.stringify(userData));
    };

    const logout = () =>
   {
    setUser(null);
    localStorage.removeItem('user');
   };

   useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
        setUser(storedUser);
    }
}, []);  
   return(
    <AuthContext.Provider value={{user,login,logout}}>
        {children}
    </AuthContext.Provider>
   );

};

export default AuthProvider;

