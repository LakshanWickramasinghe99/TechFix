import React from "react";
import logo from "../../assets/logo.png"; // Import the logo image
import HomeIcon from "@mui/icons-material/Home";
import Drawer from './ResDrawer'; // Import the Drawer component

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md">
      
        <Drawer />
        <div className="container mx-auto flex items-center justify-between p-3">
        <img src={logo} alt="TechFix Logo" className="h-16 mx-auto" />
        {/* <h1 className="text-3xl font-extrabold">TechFix Shop</h1> */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="/techHome" className="size-96 text-white hover:text-blue-400 ">
                <HomeIcon sx={{ fontSize: 30 }} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
