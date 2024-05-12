'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axiosInstance from '../user/axiosConfig'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname()
    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            router.push('/'); 
        }
    }, []);

    useEffect(()=>{
        const fetchUserDetails = async () => {
            const storedUser = localStorage.getItem("currentUser");
            const user = JSON.parse(storedUser);
        
        
            try {
              const res = await axiosInstance.get(
                `http://localhost:4000/user-details?email=${user?.email}`
              );
              if (res.status === 200) {
                console.log(res.data?.user);
                if(res.data.user?.isBlocked){
                    localStorage.removeItem('token')
                    localStorage.removeItem('currentUser')
                    router.push('/')
                }
              } else {
                console.log("Eror in verififcation");
                alert(res.data.error);
              }
            } catch (error) {
              toast.error("Verification Failed");
            }
          };
          fetchUserDetails()
    },[pathname])

    return children;
};

export default ProtectedRoute;
