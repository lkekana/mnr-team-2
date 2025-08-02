import React from "react";
import { Home, LayoutDashboard, Settings, User } from "lucide-react"; // You need lucide-react

const navItems = [
  { icon: <Home size={20} />, label: "Home" },
  { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { icon: <Settings size={20} />, label: "Settings" },
  { icon: <User size={20} />, label: "Profile" },
];

const SidebarNav = () => {
  return (
    <div className="fixed top-1/2 left-0 -translate-y-1/2 group">
      <div className="bg-white shadow-lg rounded-r-2xl overflow-hidden transition-all duration-300 group-hover:w-48 w-16">
        <ul className="flex flex-col items-center group-hover:items-start p-2 space-y-4">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center w-full px-2 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
            >
              <div className="text-gray-600">{item.icon}</div>
              <span className="ml-3 text-gray-800 font-medium opacity-0 group-hover:opacity-100 transition-all duration-200">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarNav;