import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUsers } from "../Redux/UserReducer";
import Cookies from "js-cookie";

import PageNotFound from "./PageNotFound";

import "./AllUsers.css";

const AllUsers = () => {
  const [isLoggedIn, setIsLoggedIn] = useState("true");

  const token = Cookies.get("token");
  const allUsers = useSelector(getAllUsers); 

  useEffect(() => {
    if (token === null || token === undefined) {
      setIsLoggedIn("false");
    }
  }, [token]);

  return (
    <>
      <div>
        {isLoggedIn === "true" &&
          allUsers.map((data, index) => {
            return (
              <ul key={index}>
                <div className="container">
                  <div className="container__username">{data.username}</div>
                  <div className="container__email">{data.email}</div>
                  <div className="container__mobile">{data.mobile}</div>
                </div>
              </ul>
            );
          })}
        {isLoggedIn === "false" && <PageNotFound />}
      </div>
    </>
  );
};

export default AllUsers;