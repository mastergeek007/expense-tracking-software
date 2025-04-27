import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiMoney, BiPlus, BiReceipt, BiSupport } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider";
import logo from "../../images/Wordmark_DarkBlue.png";
import { CloseIcon } from "../icons/CloseIcon";

const Sidebar = ({ onClose }) => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Optional: Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logOut()
      .then(() => {
        localStorage.removeItem("userEmail");
        toast.success("You have logged Out Successfully!!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("error", error.message);
      });
  };

  const userMenuLists = [
    {
      title: "Profile",
      path: "/profile",
    },
    {
      title: "Settings",
      path: "/settings",
    },
    {
      title: "Logout",
      path: "/login",
      onClick: handleLogout,
    },
  ];

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      path: "/",
    },
    {
      label: "Funds Category",
      path: "/fund-category",
      icon: <BiMoney className="w-4 h-4" />,
    },
    {
      label: "Costs Category",
      path: "/cost-category",
      icon: <BiMoney className="w-4 h-4" />,
    },
    {
      label: "Add Fund",
      path: "/add-fund",
      icon: <BiPlus className="w-4 h-4" />,
    },
    {
      label: "Add Cost",
      path: "/add-cost",
      icon: <BiPlus className="w-4 h-4" />,
    },
    {
      label: "Reports",
      path: "/reports",
      icon: <BiReceipt className="w-4 h-4" />,
    },
    {
      label: "Support",
      path: "/support",
      icon: <BiSupport className="w-4 h-4" />,
    },
  ];

  return (
    <div className="h-full flex flex-col ">
      <div class="relative flex flex-col h-full max-h-full z-50">
        <header class="p-4 flex justify-between items-center gap-x-2">
          <NavLink class="logo-link" to="/" aria-label="Brand">
            <div className="w-32 sm:w-40">
              <img className="w-full" src={logo} alt="Logo" />
            </div>
          </NavLink>

          <div class="lg:hidden -me-2">
            {/* Close button only for mobile */}
            {onClose && (
              <div className="flex justify-end mb-4 lg:hidden">
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <CloseIcon />
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-2 bg-white dark:bg-gray-900">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2 px-2.5 text-sm rounded-lg ${
                      isActive
                        ? "bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white"
                        : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-auto p-2 border-t border-gray-200 dark:border-neutral-700">
          <div className="relative w-full inline-flex" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              type="button"
              className="w-full inline-flex shrink-0 items-center gap-x-2 p-2 text-start text-sm text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              <img
                className="shrink-0 size-5 rounded-full"
                src={
                  user?.photoURL ||
                  "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                }
                alt="Avatar"
              />
              {user?.displayName}
              <svg
                className="shrink-0 size-3.5 ms-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-full mb-2 w-60 z-20 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-neutral-900 dark:border-neutral-700">
                <div className="p-1">
                  {userMenuLists.map((item, index) => (
                    <NavLink
                      key={index}
                      to={item.path}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Sidebar;
