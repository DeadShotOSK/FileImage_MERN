import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

import "./Register.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [user, setuser] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [formErrors, setFormErrors] = useState({
    usernameError: "",
    emailIdError: "",
    passwordError: "",
    confirmPasswordError: "",
    mobileError: ""
  });

  const [mandatory, setMandatory] = useState(false);
  const [valid, setValid] = useState(false);
  const [showPassword, setShowPssword] = useState(true);

  const [message] = useState({
    "USER_NAME_ERROR": "Please provide a username",
    "EMAILID_ERROR": "Please enter a valid email",
    "PASSWORD_ERROR": "Length should be greater then 5",
    "CONFIRM_PASSWORD_ERROR": "Password didn't match, Please re-enter password",
    "MOBILE_ERROR": "Enter a valid mobile number",
    "MANDATORY": "Please fill all the fields"
  });
  // use at least one lower & uper case letter, number and symbol

  const emailRegex = /^\S+@\S+\.\S+$/;

  const navigate = useNavigate();

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

      case "username":
        if (value.length <= 3) {
          formErrors.usernameError = message.USER_NAME_ERROR
          setValid(true);
        } else {
          formErrors.usernameError = ""
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

      case "password":
        if (value.length <= 4) {
          formErrors.passwordError = message.PASSWORD_ERROR
          setValid(true);
        } else {
          formErrors.passwordError = ""
          setValid(false);
        }
        break;

      case "confirmPassword":
        if (value !== user.password) {
          formErrors.confirmPasswordError = message.CONFIRM_PASSWORD_ERROR
          setValid(true);
        } else {
          formErrors.confirmPasswordError = ""
          setValid(false);
        }
        break;

      case "mobile":
        if (value <= 999999999) {
          formErrors.mobileError = message.MOBILE_ERROR
          setValid(true);
        } else {
          formErrors.mobileError = ""
          setValid(false);
        }
        break;

      default:
        break;
    }
    setFormErrors(errors);
  }

  const handleRegister = (e) => {
    e.preventDefault();
    const { email, password, mobile, username, confirmPassword } = user;

    if (!username || !email || !mobile || !password || !confirmPassword) {
      // alert("Please fill all the fields");
      setMandatory(message.MANDATORY);
    } else {
      axios
        .post("http://localhost:7000/users/register", user)
        .then((res) => {
          alert(res.data.message);
          navigate("/login");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <form className="form_register">
        <h2>Register Here</h2>
        <div className="register">
          <label>User Name</label>
          <input
            type="text"
            name="username"
            value={user.username}
            placeholder="User Name"
            onChange={handleChange}
          />
          <div>{formErrors.usernameError && <span className="text-danger">{formErrors.usernameError}</span>}</div>
        </div>
        <div className="register">
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
        <div className="register">
          <label>Mobile</label>
          <input
            type="number"
            name="mobile"
            value={user.mobile}
            placeholder="Enter mobile no."
            onChange={handleChange}
          />
          <div>{formErrors.mobileError && <span className="text-danger">{formErrors.mobileError}</span>}</div>
        </div>
        <div className="register">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            placeholder="Password"
            onChange={handleChange}
          />
          <div>{formErrors.passwordError && <span className="text-danger">{formErrors.passwordError}</span>}</div>
        </div>
        <div>
          <div className="register flex-row">
            <label>Confirm Password</label>
            <input
              type={showPassword ? "password" : "text"}
              name="confirmPassword"
              value={user.confirmPassword}
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            <div className="eye-icon_register">
              {showPassword ? <IoMdEye size={23} onClick={handleShow} /> : <IoMdEyeOff onClick={handleShow} size={23} />}
            </div>
          </div>
          <div>{formErrors.confirmPasswordError && <span className="text-danger">{formErrors.confirmPasswordError}</span>}</div>
        </div>
        <PasswordStrengthMeter password={user.password} />
        <div>{mandatory && <span className="text-danger">{mandatory}</span>}</div>
        {valid
          ? <button disabled className="btn btn-success" onClick={handleRegister}>
            Register
          </button>
          : <button className="btn btn-success" onClick={handleRegister}>
            Register
          </button>}
        <br />
        <p>
          Please login here <Link to="/login">Login</Link>
        </p>
      </form>
    </>
  );
};

export default Register;