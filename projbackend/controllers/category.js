const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, doc) => {
    if (err || !doc) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = doc;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, doc) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to add category in DB",
      });
    }
    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find({}).exec((err, docs) => {
    if (err) {
      return res.status(400).json({
        error: "No Categories found.",
      });
    }
    res.json(docs);
  });
};

exports.updateCategory = (req, res) => {
  var category = req.category;
  category.name = req.body.name;
  console.log(req);
  category.save((err, doc) => {
    if (err) {
      return res.status(400).json({
        error: "failed to update category",
      });
    }
    res.json(doc);
  });
};

exports.removeCategory = (req, res) => {
  var category = req.category;
  category.remove((err, doc) => {
    if (err) {
      return res.status(400).json({
        error: "failed to remove category",
      });
    }
    res.json({
      message: "Successfull deleted",
    });
  });
};
