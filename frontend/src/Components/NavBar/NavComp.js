import React from "react";
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";

const NavComp = ({ currentUser, loginLogout }) => {
    const navigate = useNavigate();
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        Cookies.remove("token");
        loginLogout(false);
        navigate("/login");
    };

    const isTableOrMobile = useMediaQuery({ query: "(max-width: 992px)" });
    return (
        <React.Fragment>
            <Link className="nav-link" to={`imageUpload/${currentUser?.data._id}`}>
                Upload Post
            </Link>
            <Link className="nav-link" to={`/image/${currentUser?.data._id}`}>
                Show Post
            </Link>
            <Link className="nav-link" to="/alluserdetails">
                All Users
            </Link>
            <Link
                className={isTableOrMobile ? "nav-link" : "nav-link btn btn-light myProfile_button"}
                to={`/myProfile/${currentUser?.data._id}`}
            >
                My Profile
            </Link>
            <Link className={isTableOrMobile ? "nav-link" : "nav-link logout_button"} onClick={handleLogout}>
                Logout
            </Link>
        </React.Fragment>
    );
}

export default NavComp;