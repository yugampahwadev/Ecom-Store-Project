import React from "react";
import Menu from "./Menu";

const Base = ({
  title = "My Title",
  description = "My description",
  className = "text-white p-4",
  children,
}) => {
  return (
    <div>
      <Menu />
      <div className="container-fluid">
        <div className="jumbotron text-white text-center">
          <h2 className="display-4">{title}</h2>
          <p className="lead">{description}</p>
        </div>
        <div className={className}>{children}</div>
      </div>
      <div className="conatiner">
        <footer className="footer  mt-auto py-3">
          <div className="bg-success text-white text-center py-3">
            <h4>If you got any questions, Feel free to reach out!</h4>
            <button className="btn btn-warning btn-lg">Contact Us</button>
          </div>
          <div className="conatiner text-center">
            <span className="text-white">
              One Stop Store for all your needs.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Base;
