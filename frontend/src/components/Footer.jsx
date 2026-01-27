import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Home,
  Info,
  Stethoscope,
  ShieldCheck,
  MessagesSquare,
  FileText,
  MessageCircleQuestion,
  RotateCcw,
  Clock,
  Phone,
  MapPin
} from "lucide-react";


const logo = "https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png"
const Footer = () => {

  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-32 backdrop-blur-xl bg-gradient-to-b from-[#f5faff]/80 to-[#eef2ff]/90 
    pt-20 pb-12 border-t border-gray-300 shadow-inner">

      <div className="max-w-7xl mx-auto px-6 grid 
      grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 text-gray-700">

        {/* Logo + About */}
        <div className="space-y-6">
          <img className="w-44 drop-shadow-lg" src={logo} alt="logo" />

          <p className="text-gray-600 leading-7">
            Experience seamless healthcare with world-class doctors, secure appointments,
            and trusted patient support — anytime, anywhere.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 pt-2">
            {[
              { icon: FaFacebookF, link: "https://facebook.com/" },
              { icon: FaInstagram, link: "https://instagram.com/" },
              { icon: FaLinkedinIn, link: "https://www.linkedin.com/in/niteshkumar864/" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center 
                  bg-white/60 backdrop-blur border border-gray-200 shadow-md
                  rounded-xl hover:shadow-xl hover:bg-primary hover:text-white 
                  hover:border-primary transition-all cursor-pointer"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Company */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Company</h2>
          <ul className="space-y-4">

            {[
              { name: "Home", path: "/", icon: Home },
              { name: "About Us", path: "/about", icon: Info },
              { name: "Doctor List", path: "/doctors", icon: Stethoscope },
              { name: "Privacy Policy", path: "/privacy-policy", icon: ShieldCheck },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <li
                  key={i}
                  onClick={() => goTo(item.path)}
                  className="cursor-pointer group text-gray-700
      hover:text-primary transition-all flex items-center gap-2"
                >
                  {/* Hover line */}
                  <span className="w-0 h-[2px] bg-primary transition-all group-hover:w-4"></span>

                  {/* Icon */}
                  <Icon size={16} className="group-hover:text-primary" />

                  {/* Text */}
                  <span className="group-hover:underline group-hover:underline-offset-4">
                    {item.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Support</h2>
          <ul className="space-y-4">

            {[
              { name: "Help Center", path: "/help-center", icon: MessagesSquare },
              { name: "Terms & Conditions", path: "/terms-conditions", icon: FileText },
              { name: "FAQs", path: "/faqs", icon: MessageCircleQuestion },
              { name: "Refund Policy", path: "/refund-policy", icon: RotateCcw },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <li
                  key={i}
                  onClick={() => goTo(item.path)}
                  className="cursor-pointer group text-gray-700
          hover:text-primary transition-all flex items-center gap-2"
                >
                  {/* Hover line */}
                  <span className="w-0 h-[2px] bg-primary transition-all group-hover:w-4"></span>

                  {/* Icon */}
                  <Icon size={16} className="text-gray-500 group-hover:text-primary" />

                  {/* Text */}
                  <span className="group-hover:underline group-hover:underline-offset-4">
                    {item.name}
                  </span>
                </li>
              );
            })}

          </ul>
        </div>


        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact</h2>

          <a
            href="mailto:medicareapp01@gmail.com"
            className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary transition-all"
          >
            <Mail size={16} />
            <span>medicareapp01@gmail.com</span>
          </a>

          <p className="flex items-center gap-2 text-gray-600 mt-4 hover:text-primary transition-all">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-gray-600 mt-4 hover:text-primary transition-all"
            >
              <Phone size={16} className="text-gray-500" />
              <span>Helpline: +91 98765 43210</span>
            </a>

          </p>

          <p className="flex items-center gap-2 text-gray-600 mt-4 hover:text-primary transition-all">
            <Clock size={16} className="text-gray-500" />
            <span>Working Hrs: 10 AM – 10 PM</span>
          </p>

          <p className="flex items-center gap-2 text-gray-600 mt-4 hover:text-primary transition-all">
            <MapPin size={16} className="text-gray-500" />
            <span>Bangalore, India</span>
          </p>

        </div>


      </div>

      {/* DISCLAIMER */}
      <div className="text-center text-sm text-gray-500 mt-12 px-6">
        <p>
          <strong>Disclaimer:</strong> This platform is a demo healthcare appointment system created for educational purposes and does not represent an official medical service provider.
        </p>
      </div>

      {/* Bottom Line */}
      <div className="bg-primary mt-6 py-3 shadow-lg shadow-primary/30">
        <p className="text-center text-white text-sm">
          © {new Date().getFullYear()} MediCare — All Rights Reserved.
        </p>
      </div>

    </div>
  );
};

export default Footer;
