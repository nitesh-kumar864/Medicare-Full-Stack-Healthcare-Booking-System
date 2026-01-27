import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Chatbot from "../chatbot/Chatbot";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <NavBar />
      <Outlet />
      <Chatbot />
      <Footer />
    </div>
  );
};

export default MainLayout;
