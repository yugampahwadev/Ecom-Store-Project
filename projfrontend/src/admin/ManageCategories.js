import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import {
  deleteCategory,
  deleteProduct,
  getAllProducts,
  getCategories,
  updateCategory,
} from "./helper/adminapicall";

const ManageProducts = () => {
  const [category, setCategory] = useState([]);
  const { user, token } = isAuthenticated();

  const prelaod = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategory(data);
      }
    });
  };

  useEffect(() => {
    prelaod();
  }, []);

  const deleteAdminCategory = (cateId) => {
    deleteCategory(cateId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        prelaod();
      }
    });
  };

  const updateAdminCategory = (cateId) => {
    updateCategory(cateId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        prelaod();
      }
    });
  };

  return (
    <Base title="Welcome Admin" description="Manage products here">
      <div className="row">
        <div className="col-12 text-center">
          <Link className="btn btn-warning" to={"/admin/dashboard"}>
            <span className="">Admin Home</span>
          </Link>
          <h2 className=" text-white my-3">
            Total {category.length} categories in DB
          </h2>
          {category.map((cate, index) => {
            return (
              <div key={index} className="row text-center mb-2">
                <div className="col-4">
                  <h3 className="text-white text-left">{cate.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/update/category/${cate._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => {
                      deleteAdminCategory(cate._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default ManageProducts;
