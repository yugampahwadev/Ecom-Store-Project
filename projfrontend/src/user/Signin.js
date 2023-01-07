import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Base from "../core/Base";

import { signin, isAuthenticated, authenticate } from "../auth/helper";

const Signin = () => {
  const [values, setValues] = useState({
    email: "yugamdev1@gmail.com",
    password: "yugamdev1",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, loading, didRedirect } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, laoding: true });
    signin({ email, password }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: JSON.stringify(data.error),
          loading: false,
        });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            didRedirect: true,
          });
        });
      }
    });
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (isAuthenticated().user && isAuthenticated().user.role === 1) {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/user/dashboard" />;
      }
    } else if (isAuthenticated()) {
      return <Navigate to="/" />;
    }
  };

  const loadingMessage = () => {
    return (
      <div className="row">
        <div className="col-md-4 offset-sm-4 text-left">
          <div
            className="alert alert-success"
            style={{ display: loading ? "" : "none" }}
          >
            loading..
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-4 offset-sm-4 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-4 offset-sm-4 text-left">
          <form>
            <div className="form-group p-1">
              <label className="text-light">Email</label>
              <input
                className="form-control"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange("email")}
              />
            </div>
            <div className="form-group p-1">
              <label className="text-light">Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange("password")}
              />
            </div>
            <div className="d-grid mt-2 ">
              <button onClick={onSubmit} className="btn btn-success rounded">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  return (
    <Base title="Sign in page" description="A page for user to sign in!">
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
      <p className="text-white text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signin;
