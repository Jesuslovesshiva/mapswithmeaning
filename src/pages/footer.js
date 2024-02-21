import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-custom-bg text-white ">
      <div className="footer-content flex flex-col items-center justify-center text-center mx-4 hide-on-small-screen">
        <h3 className="text-3xl font-medium ">
          Teocalli - A Map for every Year{" "}
        </h3>
        <p className="max-w-4xl mx-auto my-4 text-sm text-gray-400 font-mono">
          Discover the World through history with Teocalli. A dynamic,
          educational platform that brings historical events to life through
          interactive maps. Dive into the past, uncover hidden stories, and see
          the world from a new perspective — all at your fingertips.
        </p>
        <ul className="socials flex items-center justify-center ">
          {/* Update href with actual links */}
          <li className="mx-2 rounded-full fafooters ">
            <a href="https://www.instagram.com/kunstmacht/" className="  p-3">
              <FontAwesomeIcon
                icon={faInstagram}
                className="text-6xl fafooters"
                size="3x"
              />
            </a>
          </li>
          <li className="mx-2 fafooters">
            <a
              href="https://github.com/Jesuslovesshiva"
              className=" p-3 rounded-full fafooters hover:scale-100"
            >
              <FontAwesomeIcon icon={faGithub} className="text-2xl" />
            </a>
          </li>

          {/* <li className="mx-2">
            <a
              href="#"
              className="text-white border border-white p-2 rounded-full hover:text-cyan-500"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </li> */}
        </ul>
      </div>
      <div className=" footer-bottom text-center mx-5">
        <p className="text-gray-400">
          copyright &copy;{" "}
          <a href="#" className="text-grey-400  hover:text-custom-teal">
            Daniel Leitner
          </a>
          <span className="text-gray-500 text-sm ml-2 mt-2">
            • Google Geocoding API for geocoding locations, Wikipedia API for
            retrieving historical information & Images | v1.26
          </span>
        </p>
        {/* <div className="footer-menu">
          <ul className="flex justify-center space-x-4">
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
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
