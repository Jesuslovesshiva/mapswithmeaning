import React from "react";
import Link from "next/link"; // Use Next.js's Link component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white">
      <div className="footer-content flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-medium">
          Teocalli - A Map for every Year{" "}
        </h3>
        <p className="max-w-4xl mx-auto my-4 text-base text-gray-400">
          Discover the World through History with Teocalli: a dynamic,
          educational platform that brings historical events to life through
          interactive maps. By entering a specific year, users can explore
          significant events, cities, and countries from that period, visualized
          on a global map. Dive into the past, uncover hidden stories, and see
          the world from a new perspective—all at your fingertips.
        </p>
        <ul className="socials flex items-center justify-center my-1">
          {/* Update href with actual links */}
          <li className="mx-2">
            <a
              href="#"
              className="text-white border border-white p-2 rounded-full hover:text-cyan-500"
            >
              <i className="fa fa-facebook"></i>
            </a>
          </li>
          <li className="mx-2">
            <a
              href="#"
              className="text-white border border-white p-2 rounded-full hover:text-cyan-500"
            >
              <i className="fa fa-twitter"></i>
            </a>
          </li>
          <li className="mx-2">
            <a
              href="#"
              className="text-white border border-white p-2 rounded-full hover:text-cyan-500"
            >
              <i className="fa fa-google-plus"></i>
            </a>
          </li>
          <li className="mx-2">
            <a
              href="#"
              className="text-white border border-white p-2 rounded-full hover:text-cyan-500"
            >
              <i className="fa fa-youtube"></i>
            </a>
          </li>
          <li className="mx-2">
            <a
              href="#"
              className="text-white border border-white p-2 rounded-full hover:text-cyan-500"
            >
              <i className="fa fa-linkedin-square"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="footer-bottom py-5 text-center">
        <p className="text-gray-400">
          copyright &copy;{" "}
          <a href="#" className="text-grey-400">
            Daniel Leitner
          </a>
        </p>
        <div className="footer-menu">
          <ul className="flex justify-center space-x-4">
            {/* Update href with actual paths */}
            <li>
              <a href="" className="text-gray-300 hover:text-blue-400">
                Home
              </a>
            </li>
            <li>
              <a href="" className="text-gray-300 hover:text-blue-400">
                About
              </a>
            </li>
            <li>
              <a href="" className="text-gray-300 hover:text-blue-400">
                Contact
              </a>
            </li>
            <li>
              <a href="" className="text-gray-300 hover:text-blue-400">
                Blog
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
