const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, doc) => {
      if (err) {
        return res.status(400).json({
          error: "No product found",
        });
      }
      req.product = doc;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong with parsing Image",
      });
    }

    const { name, description, price, category, stock } = fields;

    console.log(name, description, price, category, stock);

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please provide all fields",
      });
    }

    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.mimetype;
    }
    product.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "Saving product in DB failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, doc) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong while deleting the product",
      });
    }
    res.json({
      message: "Deletion is Successfull",
      doc,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong with parsing Image",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);
    console.log(product);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.mimetype;
    }
    product.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "Updating product in DB failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "ascending"]])
    .exec((err, docs) => {
      if (err) {
        res.status(400).json({
          error: "No product found",
        });
      }
      res.json(docs);
    });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, docs) => {
    if (err) {
      res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      res.status(400).json({
        error: "No Category found",
      });
    }
    res.json(category);
  });
};
