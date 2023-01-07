import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { addItemToCart, removeItemFromCart } from "./helper/cartHelper";
import ImageHelper from "./helper/ImageHelper";

const Card = ({
  product,
  addtoCart = true,
  removetoCart = false,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const cardTitle = product ? product.name : "A phot from pexel";
  const cardDescription = product ? product.description : "Defualt description";
  const cardPrice = product ? product.price : "Default Price";

  const addToCart = () => {
    addItemToCart(product, () => {
      setRedirect(true);
    });
  };

  const getRedirect = (redirect) => {
    if (redirect) {
      return <Navigate to="/cart" />;
    }
  };

  const showAddToCart = (addtoCart) => {
    return (
      addtoCart && (
        <button
          onClick={addToCart}
          className="btn btn-block btn-success mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };

  const showRemoveFromCart = (removeFromCart) => {
    return (
      removeFromCart && (
        <button
          onClick={() => {
            removeItemFromCart(product._id);
            setReload(!reload);
          }}
          className="btn btn-block btn-danger mt-2 mb-2"
        >
          Remove from cart
        </button>
      )
    );
  };
  return (
    <div className="card text-black border bg-light">
      <div className="card-header lead bg-dark text-white text-center">
        {cardTitle}
      </div>
      <div className="card-body">
        {getRedirect(redirect)}
        <div className="rounded ">
          <ImageHelper product={product} />
        </div>
        <p className="lead font-weight-normal text-wrap text-center">
          {cardDescription}
        </p>
        <div className="row">
          <p className="btn btn-success rounded px-4">Price : ${cardPrice}</p>
          <div className="col-12 text-center">{showAddToCart(addtoCart)}</div>
          <div className="col-12 text-center">
            {showRemoveFromCart(removetoCart)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
