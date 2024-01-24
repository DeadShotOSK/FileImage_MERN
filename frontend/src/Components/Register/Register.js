import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

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

  const [message] = useState({
    "USER_NAME_ERROR": "Please provide a username",
    "EMAILID_ERROR": "Please enter a valid email",
    "PASSWORD_ERROR": "Length should be greater then 5",
    "CONFIRM_PASSWORD_ERROR": "Password didn't match, Please re-enter password",
    "MOBILE_ERROR": "Enter a valid mobile number",
    "MANDATORY": "Please fill all the fields"
  });

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
      <form className="form">
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
          <br />
          {formErrors.usernameError && <span className="text-danger">{formErrors.usernameError}</span>}
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
          <br />
          {formErrors.emailIdError && <span className="text-danger">{formErrors.emailIdError}</span>}
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
          <br />
          {formErrors.mobileError && <span className="text-danger">{formErrors.mobileError}</span>}
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
          <br />
          {formErrors.passwordError && <span className="text-danger">{formErrors.passwordError}</span>}
        </div>
        <div className="register">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          <br />
          {formErrors.confirmPasswordError && <span className="text-danger">{formErrors.confirmPasswordError}</span>}
        </div>
        <PasswordStrengthMeter password={user.password} />
        {valid
          ? <button disabled className="btn btn-success" onClick={handleRegister}>
            Register
          </button>
          : <button className="btn btn-success" onClick={handleRegister}>
            Register
          </button>}
          <br />
          {mandatory && <span className="text-danger">{mandatory}</span>}
      </form>
    </>
  );
};

export default Register;