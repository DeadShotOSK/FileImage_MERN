import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addImages } from "./Redux/ImageReducers";
import { addfiles } from "./Redux/FileReducers";
import { addUsers } from "./Redux/UserReducer";
import { socket } from "./socket";

import NavBar from "./Components/NavBar/NavBar";
import ShowImage from "./Components/ShowImage";
import AllUsers from "./Components/AllUsers";
import UserDetails from "./Components/UserDetails";
import MyProfile from "./Components/MyProfile";
import ImageUpload from "./Components/ImageUpload/ImageUpload";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";

import "./App.css";
import PageNotFound from "./Components/PageNotFound";

export const GlobalData = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updateReduxStore, setUpdateReduxStore] = useState(false);

  const token = Cookies.get("token");
  // for storinng current user to local strorage
  useEffect(() => {
    let user = localStorage.getItem("user");
    setCurrentUser(JSON.parse(user));
    if (token === null || token === undefined) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [token, isLoggedIn]);

  const dispatch = useDispatch();

  const loginLogout = (data) => {
    setIsLoggedIn(data);
  }

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get("http://localhost:7000/users/userdetails", { headers })
      .then((res) => {
        // setAllUsers(res.data.allUsers);
        dispatch(addUsers(res.data.allUsers));
      });
  }, [dispatch, token]);

  const updateData = (data) => {
    setUpdateReduxStore(data);
  }

  // For Images => redux store
  useEffect(() => {
    axios
      .get("http://localhost:7000/fi/getAllImages")
      .then((res) => {
        if (res.data.status === "false") {
          alert(res.data.message);
        } else {
          dispatch(addImages(res.data.imageData));
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // For Files => redux store
    axios
      .get("http://localhost:7000/fi/getAllFiles")
      .then((res) => {
        if (res.data.status === "false") {
          alert(res.data.message);
        } else {
          dispatch(addfiles(res.data.allFiles));
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setUpdateReduxStore(false);
  }, [dispatch, updateReduxStore]);

  return (
    <>
      <Router>
        {/* loginLogout -> NavComp, Login || isLoggedIn -> all component */}
        <GlobalData.Provider value={{ loginLogout, isLoggedIn }}>
          <NavBar currentUser={currentUser} isLoggedIn={isLoggedIn} />
          <Routes>
            <Route exact path="/" element={<AllUsers />}></Route>
            <Route exact path="/myProfile/:userid" element={<MyProfile socket={socket} updateData={updateData} />}></Route>
            <Route exact path="/imageUpload/:userid" element={<ImageUpload updateData={updateData} />}></Route>
            <Route exact path="/allusers" element={<AllUsers />}></Route>
            <Route exact path="/alluserdetails" element={<UserDetails />}></Route>
            <Route exact path="/image/:userid" element={<ShowImage socket={socket} />}></Route>
            <Route exact path="/register" element={<Register />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </GlobalData.Provider>
      </Router>
    </>
  );
}

export default App;