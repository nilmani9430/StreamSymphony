import React, { useEffect, useState } from "react";
import basestyle from "../Base.module.css";
import registerstyle from "./Register.module.css";
import axios from "axios";

import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
const Register = () => {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.name) {
      error.name = "First Name is required";
    }
    // if (!values.lname) {
    //   error.lname = "Last Name is required";
    // }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    // if (!values.cpassword) {
    //   error.cpassword = "Confirm Password is required";
    // } else if (values.cpassword !== values.password) {
    //   error.cpassword = "Confirm password and password should be same";
    // }
    return error;
  };
  const signupHandler = (e) => {
    const updatedUser = { ...user };
  //  delete updatedUser.fname;
    setUserDetails(updatedUser);
    // console.log(user);
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
    // if (!formErrors) {
    //   setIsSubmit(true);
    // }
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      // console.log(user);
      axios.post("http://localhost:3000/api/v1/signup", user).then((res) => {
        toast.success(res.data.message);
        navigate("/login", { replace: true });
      });
    }
  }, [formErrors, isSubmit, navigate, user]);
  return (
    <>
      <div className={registerstyle.register}>
        <form>
          <h1>Create your account</h1>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            onChange={changeHandler}
            value={user.name}
          />
          <p className={basestyle.error}>{formErrors.name}</p>
          {/* <h1>Create your account</h1>
          <input
            type="text"
            name="fname"
            id="fname"
            placeholder="First Name"
            onChange={changeHandler}
            value={user.fname}
          />
          <p className={basestyle.error}>{formErrors.fname}</p>
          <input
            type="text"
            name="lname"
            id="lname"
            placeholder="Last Name"
            onChange={changeHandler}
            value={user.lname}
          />
          <p className={basestyle.error}>{formErrors.lname}</p> */}
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={changeHandler}
            value={user.email}
          />
          <p className={basestyle.error}>{formErrors.email}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
          />
          <p className={basestyle.error}>{formErrors.password}</p>
          {/* <input
            type="password"
            name="cpassword"
            id="cpassword"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={user.cpassword}
          />
          <p className={basestyle.error}>{formErrors.cpassword}</p> */}
          <button className={basestyle.button_common} onClick={signupHandler}>
            Register
          </button>
        </form>
        <NavLink to="/login">Already registered? Login</NavLink>
      </div>
    </>
  );
};
export default Register;
