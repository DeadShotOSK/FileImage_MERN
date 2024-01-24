import axios from "axios";
import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";

import PageNotFound from "./PageNotFound";

import "./AllUsers.css";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState("true");

  const token = Cookies.get("token");

  useEffect(() => {
    if (token === null || token === undefined) {
      setIsLoggedIn("false");
    }
  }, [token]);

  useEffect(() => {
    axios.get("http://localhost:7000/users/allusers").then((res) => {
      setAllUsers(res.data.allUsers);
  }).catch((err) => {
    console.log("err", err);
  });
  }, []);

  return (
    <>
      {isLoggedIn === "true" && <PageNotFound />}
      {isLoggedIn === "false" && (
        <div>
          {allUsers.map((data, index) => {
            return (
              <ul key={index}>
                <div className="container">
                  <div className="container__username">{data.username}</div>
                </div>
              </ul>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AllUsers;