"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const pathname = usePathname(); // Get current path for active link highlighting

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo and Brand */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Tecno Blocks Logo"
          />
          <span className="self-center text-2xl font-semibold text-gray-800">
            Tecno Blocks
          </span>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-800 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Nav Links */}
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="flex flex-col p-4 mt-4 bg-white rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:bg-white md:border-0">
            <li>
              <Link
                href="/"
                className={`block py-2 pl-3 pr-4 rounded ${
                  pathname === "/"
                    ? "bg-blue-600 text-white rounded-lg"
                    : "text-gray-800 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600"
                }`}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/add-device"
                className={`block py-2 pl-3 pr-4 rounded ${
                  pathname === "/add-device"
                    ? "bg-blue-600 text-white rounded-lg"
                    : "text-gray-800 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600"
                }`}
              >
                Add Device
              </Link>
            </li>
            <li>
              <Link
                href="/my-profile"
                className={`block py-2 pl-3 pr-4 rounded ${
                  pathname === "/my-profile"
                    ? "bg-blue-600 text-white rounded-lg"
                    : "text-gray-800 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600"
                }`}
              >
                My Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
