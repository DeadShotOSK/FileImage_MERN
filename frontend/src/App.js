import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addImages } from "./Redux/ImageReducers";
import { addfiles } from "./Redux/FileReducers";
import { addUsers } from "./Redux/UserReducer";
import { socket } from "./socket";

import NavBar from "./Components/NavBar";
import ShowImage from "./Components/ShowImage";
import AllUsers from "./Components/AllUsers";
import UserDetails from "./Components/UserDetails";
import MyProfile from "./Components/MyProfile";
import ImageUpload from "./Components/ImageUpload/ImageUpload";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState("");

  const token = Cookies.get("token");
  // for storinng current user to local strorage
  useEffect(() => {
    let u = localStorage.getItem("user");
    setCurrentUser(JSON.parse(u));
  }, []);

  const dispatch = useDispatch()

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get("http://localhost:7000/users/userdetails", { headers })
      .then((res) => {
        // setAllUsers(res.data.allUsers);
        dispatch(addUsers(res.data.allUsers));
      });
  }, [dispatch, token]);

  // For Images => redux store
  useEffect(() => {
    axios
      .get("http://localhost:7000/fi/getAllImages")
      .then((res) => {
        if (res.data.status === "false") {
          alert(res.data.message);
        } else {
          // alert(res.data.message);
          dispatch(addImages(res.data.imageData));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  // For Files => redux store
  useEffect(() => {
    axios
      .get("http://localhost:7000/fi/getAllFiles")
      .then((res) => {
        if (res.data.status === "false") {
          alert(res.data.message);
        } else {
          dispatch(addfiles(res.data.allFiles));
          // alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  return ( 
    <>
      <Router>
        <NavBar currentUser={currentUser} />
        <Routes>
          <Route exact path="/" element={<AllUsers />}></Route>
          <Route exact path="/myProfile/:userid" element={<MyProfile socket={socket} />}></Route>
          <Route exact path="/imageUpload/:userid" element={<ImageUpload />}></Route>
          <Route exact path="/allusers" element={<AllUsers />}></Route>
          <Route exact path="/alluserdetails" element={<UserDetails />}></Route>
          <Route exact path="/image/:userid" element={<ShowImage socket={socket} />}></Route>
          <Route exact path="/register" element={<Register />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;