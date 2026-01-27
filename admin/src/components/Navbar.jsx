import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import Loader from "./Loader";   // ⬅ ADD THIS

const Navbar = () => {

    const { aToken, setAToken, isAdminLoading, isAdminPageLoading } = useContext(AdminContext);
    const { dToken, setDToken } = useContext(DoctorContext);

    const navigate = useNavigate();

    /* -------------------------- Loader for Navbar -------------------------- */
    if (isAdminLoading || isAdminPageLoading) {
        return (
            <div className="w-full flex justify-center py-4 bg-white border-b">
                <Loader />
            </div>
        );
    }

    /* -------------------------- LOGOUT -------------------------- */
    const logout = () => {
        toast.success("Logout successful!");

        // Admin logout
        if (aToken) {
            setAToken('');
            localStorage.removeItem('aToken');
        }

        // Doctor logout
        if (dToken) {
            setDToken('');
            localStorage.removeItem('dToken');
        }

        setTimeout(() => {
            navigate('/');
        }, 700);
    };

    return (

        
        <div className='fixed top-0 left-0 w-full z-50  flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white shadow-sm'>
            
            <div className='flex items-center gap-2 text-sm'>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
                    {aToken ? 'Admin' : 'Doctor'}
                </p>
            </div>

            <button
                onClick={logout}
                className='bg-primary text-white text-sm px-10 py-2 rounded-full hover:bg-primary/90 transition-all'
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar;
