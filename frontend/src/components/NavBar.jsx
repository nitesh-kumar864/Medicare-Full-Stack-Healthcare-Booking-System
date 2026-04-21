import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
    User,
    CalendarCheck,
    BedDouble,
    HelpCircle,
    LogOut,
} from "lucide-react";

const NavBar = () => {
    const navigate = useNavigate();
    const { userData, logout } = useContext(AppContext);

    const [showMenu, setShowMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const DropdownItem = ({ icon, label, onClick }) => (
        <button
            onClick={() => {
                onClick?.();
                setShowDropdown(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition"
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="fixed top-0 left-0 w-full bg-white z-50 flex items-center justify-between text-sm py-4 px-4 md:px-10 border-b border-gray-200 shadow-sm">
            {/* Logo */}
            <img
                onClick={() => navigate("/")}
                className="w-44 cursor-pointer"
                src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png"}
                alt="logo"
            />

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-start gap-5 font-medium">
                {[
                    { to: "/", label: "HOME" },
                    { to: "/doctors", label: "ALL DOCTORS" },
                    { to: "/about", label: "ABOUT" },
                    { to: "/contact", label: "CONTACT US" },
                ].map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `py-1 border-b-2 ${isActive ? "border-primary text-primary" : "border-transparent"
                            }`
                        }
                    >
                        <li>{item.label}</li>
                    </NavLink>
                ))}

                {/* Admin */}
                <li
                    onClick={() =>
                        window.open("https://medicare-admin-beta.vercel.app", "_blank")
                    }
                    className="py-1 cursor-pointer"
                >
                    <button className="border border-gray-300 px-5 py-1 rounded-full hover:bg-gray-50">
                        Admin Panel
                    </button>
                </li>
            </ul>

            {/* Right Section */}
            <div className="flex items-center gap-4 relative">
                {userData ? (
                    <div ref={dropdownRef} className="relative">
                        {/* Profile (CLICK ONLY) */}
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setShowDropdown((prev) => !prev)}
                        >
                            <img
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                src={userData.image}
                                alt="profile"
                            />
                            <img
                                className="w-2.5"
                                src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459430/dropdown_icon_fcilop.svg"}
                                alt="dropdown"
                            />
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 z-30">
                                <div className="w-64 rounded-xl bg-white text-gray-700 shadow-xl border border-gray-200 overflow-hidden">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="font-semibold text-gray-900 truncate">
                                            @{userData.username}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {userData.email}
                                        </p>
                                    </div>

                                    {/* Items */}
                                    <div className="py-2 text-sm">
                                        <DropdownItem
                                            icon={<User size={18} />}
                                            label="My Profile"
                                            onClick={() => navigate("/my-profile")}
                                        />
                                        <DropdownItem
                                            icon={<CalendarCheck size={18} />}
                                            label="My Appointments"
                                            onClick={() => navigate("/my-appointments")}
                                        />
                                        <DropdownItem
                                            icon={<BedDouble size={18} />}
                                            label="My Beds"
                                            onClick={() => navigate("/my-bed-bookings")}
                                        />
                                        <DropdownItem
                                            icon={<HelpCircle size={18} />}
                                            label="My Queries"
                                            onClick={() => navigate("/my-support")}
                                        />

                                        <div className="my-2 border-t border-gray-200" />

                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 transition"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-primary text-white px-8 py-3 rounded-full hidden md:block"
                    >
                        Create account
                    </button>
                )}

                {/* Mobile Menu */}
                <img
                    onClick={() => setShowMenu(true)}
                    className="w-6 md:hidden"
                    src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459496/menu_icon_yvijge.svg"}
                    alt="menu"
                />
            </div>
            {/* ================= MOBILE SLIDE MENU ================= */}
            <div
                className={`fixed top-0 right-0 bottom-0 z-40 bg-white transition-all duration-300 flex flex-col
  ${showMenu ? "w-full" : "w-0 overflow-hidden"} md:hidden`}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between px-5 py-6 border-b border-gray-100">
                    <img className="w-36" src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png"} alt="logo" />
                    <img
                        className="w-7 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setShowMenu(false)}
                        src={"https://res.cloudinary.com/dozq9qzhh/image/upload/v1769459562/cross_icon_mshwgu.png"}
                        alt="close"
                    />
                </div>

                <ul className="flex-1 flex flex-col justify-center items-center gap-8 text-xl font-medium text-gray-600">
                    <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/"
                        className={({ isActive }) =>
                            `hover:text-black transition-colors ${isActive ? "text-primary border-b-2 border-primary pb-1" : ""}`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/doctors"
                        className={({ isActive }) =>
                            `hover:text-black transition-colors ${isActive ? "text-primary border-b-2 border-primary pb-1" : ""}`
                        }
                    >
                        All Doctors
                    </NavLink>

                    <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/about"
                        className={({ isActive }) =>
                            `hover:text-black transition-colors ${isActive ? "text-primary border-b-2 border-primary pb-1" : ""}`
                        }
                    >
                        About
                    </NavLink>

                    <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/contact"
                        className={({ isActive }) =>
                            `hover:text-black transition-colors ${isActive ? "text-primary border-b-2 border-primary pb-1" : ""}`
                        }
                    >
                        Contact Us
                    </NavLink>
                    <li
                        onClick={() => {
                            window.open("https://medicare-admin-beta.vercel.app", "_blank");
                            setShowMenu(false);
                        }}
                        className="mt-4 px-8 py-3 border border-gray-400 rounded-full cursor-pointer hover:bg-gray-100 hover:border-gray-600 transition-all shadow-sm"
                    >
                        Admin Panel
                    </li>
                </ul>

                <div className="h-20"></div>
            </div>
        </div>
    );
};

export default NavBar;
