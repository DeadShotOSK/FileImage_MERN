import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

// import LoadingSpinner from "../PopUp/LodingSpinner";

import "./Login.css";
import PageNotFound from "../PageNotFound";

const Login = ({ isLoggedIn, loginLogout }) => {
  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({
    emailIdError: "",
    passwordError: "",
  });

  const [mandatory, setMandatory] = useState(false);
  const [valid, setValid] = useState(false);
  const [showPassword, setShowPssword] = useState(true);
  // const [loading, setLoading] = useState(false);

  const [message] = useState({
    "EMAILID_ERROR": "Please enter a valid email",
    "PASSWORD_ERROR": "Length should be greater then 5",
    "MANDATORY": "Please fill all the fields"
  });

  const emailRegex = /^\S+@\S+\.\S+$/;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setuser({
      ...user,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleShow = () => {
    setShowPssword(!showPassword);
  };

  const validateField = (name, value) => {
    let errors = formErrors
    switch (name) {

      case "password":
        if (value.length <= 4) {
          formErrors.passwordError = message.PASSWORD_ERROR
          setValid(true);
        } else {
          formErrors.passwordError = ""
          setValid(false);
        }
        break;

      case "email":
        if (!emailRegex.test(value)) {
          formErrors.emailIdError = message.EMAILID_ERROR
          setValid(true);
        } else {
          formErrors.emailIdError = ""
          setValid(false);
        }
        break;

      default:
        break;
    }
    setFormErrors(errors);
  }

  const handleLogin = (e) => {
    e.preventDefault();

    const { email, password } = user;

    if (!email || !password) {
      // alert("Please fill all the fields");
      setMandatory(message.MANDATORY)
    } else {
      setMandatory("");
      if (email && password) {
        axios
          .post("http://localhost:7000/users/login", user)
          .then((res) => {
            if (res.data.status === "false") {
              alert(res.data.message);
              console.log(res.data.data);
            } else {
              alert(res.data.message);
              Cookies.set('token', res.data.auth.token, { expires: 0.08334 })
              localStorage.setItem(
                "user",
                JSON.stringify({
                  data: res.data.data,
                  type: res.data.type,
                  // token: res.data.auth.token, // we can also store token inside local storage
                })
              );
              navigate(`/image/${res.data.data._id}`);
              loginLogout(true);
              // window.location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <PageNotFound />
      ) : (
        <form className="form_login">
          <h2>Login</h2>
          <div className="login">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={user.email}
              placeholder="Email"
              onChange={handleChange}
            />
            <div>{formErrors.emailIdError && <span className="text-danger">{formErrors.emailIdError}</span>}</div>
          </div>
          <div>
            <div className="login flex-row">
              <label>Password</label>
              <input
                type={showPassword ? "password" : "text"}
                name="password"
                value={user.password}
                placeholder="Password"
                onChange={handleChange}
              />
              <div className="eye-icon_login">
                {showPassword ? <IoMdEye size={23} onClick={handleShow} /> : <IoMdEyeOff onClick={handleShow} size={23} />}
              </div>
            </div>
            {formErrors.passwordError && <span className="text-danger">{formErrors.passwordError}</span>}
          </div>
          <div>{mandatory && <span className="text-danger">{mandatory}</span>}</div>
          {valid
            ? <button disabled className="btn btn-success" onClick={handleLogin}>
              Login
            </button>
            : <button className="btn btn-success" onClick={handleLogin}>
              Login
            </button>}
          <br />
          <p>
            Please register here <Link to="/register">Sign up</Link>
          </p>
        </form>
      )}
      {/* <LoadingSpinner /> */}
    </>
  );
};

export default Login;