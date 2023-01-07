import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ product }) => {
  const productUrl = product
    ? `${API}product/photo/${product._id}`
    : `https://images.pexels.com/photos/6367401/pexels-photo-6367401.jpeg?auto=compress&cs=tinysrgb&w=600`;
  console.log(productUrl);
  return (
    <img
      src={productUrl}
      alt="photo"
      style={{ maxHeight: "100%", maxWidth: "100%" }}
      className="mb-3 rounded"
    />
  );
};

export default ImageHelper;
