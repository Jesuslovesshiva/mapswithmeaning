import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-custom-bg text-white ">
      <div className="footer-content flex flex-col items-center justify-center text-center mx-4 hide-on-small-screen">
        <h3 className="text-3xl font-medium ">
          <div className="divider text-color-bg">
            <hr className="gradient" /> <p className="text-gray-300 mt-10"></p>
          </div>
          Teocalli - A Map for every Year{" "}
        </h3>
        <p className="max-w-4xl mx-auto my-4 text-sm text-gray-400 font-mono">
          Discover the World through history with Teocalli. A dynamic,
          educational platform that brings historical events to life through
          interactive maps. Dive into the past, uncover hidden stories, and see
          the world from a new perspective — all at your fingertips.
        </p>
        {/* <ul className=" flex items-center justify-center ">
          <li className="mx-2 ">
            <a
              href="https://www.instagram.com/kunstmacht/"
              className=" fa-fw p-5  hover:text-custom-teal"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </li>
          <li className="mx-2 ">
            <a
              href="https://github.com/Jesuslovesshiva"
              className="fa-fw p-5 hover:text-custom-teal"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </li>
        </ul> */}
      </div>
      {/* <div className=" footer-bottom text-center ">
        <p className="text-gray-400">
          copyright &copy;{" "}
          <span href="#" className="text-grey-400  hover:text-custom-teal">
            Daniel Leitner
          </span>
          <span className="text-gray-500 text-sm">• | v1.29</span>
        </p>
      </div> */}
    </footer>
  );
};

export default Footer;
