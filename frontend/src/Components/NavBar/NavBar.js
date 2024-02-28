import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { VscMenu } from "react-icons/vsc";
import NavComp from "./NavComp";

import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css"

const NavBar = ({ currentUser, isLoggedIn }) => {
  const [hamBurger, setHamBurger] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const isTableOrMobile = useMediaQuery({ query: "(max-width: 992px)" });
  const handleHamBurgerClick = () => {
    setHamBurger(!hamBurger);
    setIsShow(!isShow);
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mainNav">
        <div className="container-fluid">
          {isLoggedIn ? (
            <div className="nav navbar-nav">
              <div className="nav-link username_title">
                {currentUser?.data.username}
              </div>
              {isTableOrMobile ? (
                <VscMenu size={33} className="hamBurger" onClick={handleHamBurgerClick} />
              ) : (
                <NavComp currentUser={currentUser} />
              )}

              {hamBurger && isTableOrMobile && (
                <div className={isShow ? "ModalOpen" : "ModalClosed"}>
                  <NavComp currentUser={currentUser} />
                </div>
              )}
            </div>
          ) : <div className="nav navbar-nav">
            <Link className="nav-link" to="./allusers">
              Users
            </Link>
            <Link className="nav-link btn btn-success" to="/login">
              Login
            </Link>
          </div>}

        </div>
      </nav>
    </>
  );
};

export default NavBar;