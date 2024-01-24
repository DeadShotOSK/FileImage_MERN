import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = ({ currentUser }) => {

  const handleLogout = () => {
    window.location.reload();
    localStorage.clear();
    Cookies.remove("token");
    window.location.href = "/login";
  };
  const logout = {
    borderRadius: "5px",
    backgroundColor: "#e63737",
    color: "white",
    textAlign: "center",
    marginLeft: "10px",
    position: "absolute",
    right: "0",
    transform: "translate(-20px, 0)",
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        style={{ position: "sticky", top: 0, zIndex: 1 }}
      >
        <div className="container-fluid">
          <div className="nav navbar-nav">
            {currentUser?.type === "user" && (
              <div
                className="nav-link"
                style={{
                  color: "green",
                  border: "1px solid green",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                {currentUser?.data.username}
              </div>
            )}
            {currentUser?.type === "user" && (
              <Link
                className="nav-link"
                to={`imageUpload/${currentUser?.data._id}`}
              >
                Upload Post
              </Link>
            )}
            {currentUser?.type === "user" && (
              <Link className="nav-link" to={`/image/${currentUser?.data._id}`}>
                Show Post
              </Link>
            )}
            {currentUser?.type === "user" && (
              <Link className="nav-link" to="/alluserdetails">
                All Users
              </Link>
            )}
            {currentUser?.type === "user" && (
              <Link
                className="nav-link btn btn-light"
                to={`/myProfile/${currentUser?.data._id}`}
                style={{
                  position: "absolute",
                  right: "0",
                  transform: "translate(-100px, 0)",
                  border: "1px solid grey",
                  borderRadius: "5px"
                }}
              >
                My Profile
              </Link>
            )}
            {currentUser?.type === "user" && (
              <Link className="nav-link" style={logout} onClick={handleLogout}>
                Logout
              </Link>
            )}
            {!currentUser && (
              <Link className="nav-link" to="./allusers">
                Users
              </Link>
            )}
            {/* {!currentUser && (<Link
              className="nav-link"
              to="/register"
              style={{ border: "1px solid green" }}
            >
              Sign up
            </Link>
            )} */}
            {!currentUser && (
              <Link className="nav-link btn btn-success" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;