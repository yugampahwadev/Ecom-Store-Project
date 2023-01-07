const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, doc) => {
    if (err || !doc) {
      return res.status(400).json({
        error: "No user found in DB",
      });
    }
    req.profile = doc;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encrypt_password = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, doc) => {
      if (err) {
        res.status(400).json({
          error: "you are not authorised to update details",
        });
      }
      doc.salt = undefined;
      doc.encrypt_password = undefined;
      res.json(doc);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        res.status(400).json({
          error: "No order in this account",
        });
      }
      return res.json(order);
    });
};

exports.pushOrderPurchaseInList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((item) => {
    purchases.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
    }
  );
  next();
};
