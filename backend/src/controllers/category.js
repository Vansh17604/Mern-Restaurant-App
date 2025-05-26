const Category = require('../models/category');
const { check, validationResult } = require('express-validator');

module.exports.CreateCategory = [
  check('categoryName.en')
    .notEmpty().withMessage('English name is required')
    .isLength({ min: 3 }).withMessage('English name must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('English name must be under 20 characters'),
  check('categoryName.es')
    .notEmpty().withMessage('Spanish name is required')
    .isLength({ min: 3 }).withMessage('Spanish name must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('Spanish name must be under 20 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newCategory = new Category({
      categoryName: req.body.categoryName,
      status: "Active"
    });

    try {
      const savedCategory = await newCategory.save();
      res.json(savedCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

module.exports.UpdateCategory = [
  check('categoryName.en')
    .notEmpty().withMessage('English name is required')
    .isLength({ min: 3 }).withMessage('English name must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('English name must be under 20 characters'),
  check('categoryName.es')
    .notEmpty().withMessage('Spanish name is required')
    .isLength({ min: 3 }).withMessage('Spanish name must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('Spanish name must be under 20 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryName, status } = req.body;
    const categoryId = req.params.id;
    try {
      const category = await Category.findByIdAndUpdate(
        categoryId,
        { categoryName, status },
        { new: true }
      );
      res.json(category);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

module.exports.UpdateCategoryStatus = [
  check('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Active', 'Deactive']).withMessage('Status must be either Active or Deactive'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryId = req.params.id;
    const { status } = req.body;

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { status },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json(updatedCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

module.exports.DeleteCategory = [
  async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.deleteOne();
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

module.exports.FetchCategory = [
  async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

module.exports.FetchCategorywithActivestatus = [
  async (req, res) => {
    try {
      const categories = await Category.find({ status: "Active" });
      res.json(categories);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];
