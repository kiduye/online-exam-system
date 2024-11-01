
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import {
  FaBuilding,
  FaBullhorn,
  FaCalendarAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardCheck,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const [open, setOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const sidebar = useRef(null);

  const Menus = [
    { title: "Dashboard", icon: <MdDashboard />, path: "overview" },
    { title: "Course Management", icon: <FaClipboardCheck />, path: "add-courses" },
    { title: "Manage Students", icon: <FaUserGraduate />, path: "manage/student" },
    { title: "Manage Instructors", icon: <FaChalkboardTeacher />, path: "manage/instructor" },
    { title: "Manage Dep't Board", icon: <FaBuilding />, path: "manage/department" },
    // { title: "Announcement", icon: <FaBullhorn />, path: "announcement" },
    { title: "Exam Schedule", icon: <FaCalendarAlt />, path: "schedules" },
    
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebar.current && !sidebar.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Menu button for mobile devices */}
      <div className="md:hidden p-4">
        <FiMenu
          className={`text-2xl ${sidebarOpen ? "text-white" : "text-gray-800"}`}
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${sidebarOpen ? "bg-gray-800" : "bg-blue-100"} shadow-lg lg:static lg:translate-x-0 ${
          sidebarExpanded ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar scroll-smooth">
          <div className="flex items-center justify-between p-8 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-500">
            <span className={`text-white font-bold uppercase italic ${sidebarExpanded ? "" : "hidden"}`}>WBES</span>
            <button
              className="text-white text-2xl md:hidden"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>
          <ul className="flex-1 space-y-3 p-4">
            {Menus.map((menu, index) => (
              <li
                key={index}
                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                  pathname.includes(menu.path) ? "bg-blue-500" : ""
                }`}
              >
                <NavLink
                  to={menu.path}
                  className={`flex items-center space-x-4 text-sm font-medium ${
                    pathname.includes(menu.path) ? "text-white" : "text-gray-300"
                  }`}
                >
                  {menu.icon}
                  <span className={`${sidebarExpanded ? "" : "hidden"}`}>{menu.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        {/* Expand/Collapse Button at Bottom Right Corner */}
        <div className="absolute bottom-4 right-4">
          <button
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            <span className="sr-only">Expand / collapse sidebar</span>
            <svg
              className={`shrink-0 fill-current text-gray-400 dark:text-gray-500 transform ${
                sidebarExpanded ? "" : "rotate-180"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay for mobile view */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
