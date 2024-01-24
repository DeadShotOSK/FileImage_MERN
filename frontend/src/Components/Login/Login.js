import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

import "./Login.css";

const Login = () => {
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
                  // ...res.data.data,
                  data: res.data.data,
                  type: res.data.type,
                  // token: res.data.auth.token, // we can also store token inside local storage
                })
              );
              navigate(`/image/${res.data.data._id}`);
              window.location.reload();
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
      <form className="form">
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
          <br />
          {formErrors.emailIdError && <span className="text-danger">{formErrors.emailIdError}</span>}
        </div>
        <div className="login">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            placeholder="Password"
            onChange={handleChange}
          />
          <br />
          {formErrors.passwordError && <span className="text-danger">{formErrors.passwordError}</span>}
        </div>
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
          {mandatory && <span className="text-danger">{mandatory}</span>}
      </form>
    </>
  );
};

export default Login;