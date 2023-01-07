import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import {  updateCategory } from "./helper/adminapicall";

const UpdateCategory = () => {
  const params = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, token } = isAuthenticated();

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    updateCategory(params.categoryId, user._id, token, { name }).then(
      (data) => {
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      }
    );
  };

  const successMessage = () => {
    if (success) {
      return (
        <h4 className="text-success text-center text-white">
          Category updated Successfully
        </h4>
      );
    }
  };

  const errorMessage = () => {
    if (error) {
      return (
        <h4 className="text-success text-center text-white">
          Failed to update category
        </h4>
      );
    }
  };

  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group col-6 offset-3">
          <p className="lead text-white">Enter your category</p>
          <input
            type="text"
            className="form-control my-3"
            autoFocus
            required
            placeholder="For Ex. Summer"
            onChange={handleChange}
            value={name}
          />
          <div className="container text-center">
            <button onClick={onSubmit} className="btn btn-success">
              Update Category
            </button>
            <Link className="btn btn-success m-2" to="/admin/dashboard">
              Admin Home
            </Link>
          </div>
        </div>
      </form>
    );
  };
  return (
    <Base
      title="Update a category"
      description="Update category for any product"
      className="conatiner p-4"
    >
      <div className="col-md-8 offset-md-2">
        {myCategoryForm()}
        {successMessage()}
        {errorMessage()}
      </div>
    </Base>
  );
};

export default UpdateCategory;
