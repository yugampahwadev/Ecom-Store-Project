import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { createProduct, getCategories } from "./helper/adminapicall";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getRedirect: "",
    formData: "",
  });
  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getRedirect,
    formData,
  } = values;
  const preload = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    createProduct(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          price: "",
          stock: "",
          photo: "",
          loading: false,
          createdProduct: data.name,
        });
      }
    });
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: createdProduct ? "" : "none" }}
      >
        <h4>{createdProduct} created successfully</h4>
        {loadingAdmin()}
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="alert alert-success text-center mt-3"
        style={{ display: error ? "" : "none" }}
      >
        <h4>Failed to create the product - {error}</h4>
        {loadingAdmin()}
      </div>
    );
  };

  const loadingAdmin = () => {
    if (loading) {
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    }
  };

  const createProductForm = () => {
    return (
      <form>
        <span className="col-8 offset-2">Post Photo</span>
        <div className="form-group mb-2 p-2 col-8 offset-2 bg-white text-black">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="Choose a file"
          />
        </div>
        <div className="form-group mb-2 col-8 offset-2">
          <input
            onChange={handleChange("name")}
            name="name"
            className="form-control"
            placeholder="Name"
            value={name}
          />
        </div>
        <div className="form-group mb-2 col-8 offset-2">
          <textarea
            onChange={handleChange("description")}
            name="description"
            className="form-control"
            placeholder="Description"
            value={description}
          />
        </div>
        <div className="form-group mb-2 col-8 offset-2">
          <input
            onChange={handleChange("price")}
            type="number"
            className="form-control"
            placeholder="Price"
            value={price}
          />
        </div>
        <div className="form-group mb-2 col-8 offset-2">
          <select
            onChange={handleChange("category")}
            className="form-control"
            placeholder="Category"
          >
            <option>Select</option>
            {categories &&
              categories.map((cate, index) => {
                return (
                  <option key={index} value={cate._id}>
                    {cate.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="form-group mb-2 col-8 offset-2">
          <input
            onChange={handleChange("stock")}
            type="number"
            className="form-control"
            placeholder="quantity"
            value={stock}
          />
        </div>
        <div className="conatiner text-center">
          <button type="submit" onClick={onSubmit} className="btn btn-success">
            Create Product
          </button>
          <Link className="btn btn-success m-2" to="/admin/dashboard">
            Admin Home
          </Link>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Add Product here!"
      description="Welcome to Product Creation Section"
      className="conatainer p-4"
    >
      <div className="row text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {createProductForm()}
        </div>
      </div>
    </Base>
  );
};

export default AddProduct;
