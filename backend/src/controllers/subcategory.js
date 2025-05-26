const Subcategory = require('../models/subcategory');
const { check, validationResult } = require('express-validator');

// Create Subcategory
module.exports.CreateSubcategory = [
    check('categoryid').notEmpty().withMessage('Category Id is required'),
    check('subcategoryname.en')
        .isLength({ min: 3 }).withMessage('English name must be at least 3 characters')
        .isLength({ max: 20 }).withMessage('English name must be under 20 characters'),
    check('subcategoryname.es')
        .isLength({ min: 3 }).withMessage('Spanish name must be at least 3 characters')
        .isLength({ max: 20 }).withMessage('Spanish name must be under 20 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newSubcategory = new Subcategory({
                categoryid: req.body.categoryid,
                subcategoryname: req.body.subcategoryname,
                status: "Active"
            });

            const savedSubcategory = await newSubcategory.save();
            res.json(savedSubcategory);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Edit Subcategory
module.exports.EditSubCategory = [
    check("categoryid").notEmpty().withMessage("Category Id is required"),
    check("subcategoryname.en")
        .isLength({ min: 3 }).withMessage("English name must be at least 3 characters")
        .isLength({ max: 20 }).withMessage("English name must be under 20 characters"),
    check("subcategoryname.es")
        .isLength({ min: 3 }).withMessage("Spanish name must be at least 3 characters")
        .isLength({ max: 20 }).withMessage("Spanish name must be under 20 characters"),
    check("status").isIn(["Active", "Deactive"]).withMessage("Status must be either Active or Deactive"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedSubcategory = await Subcategory.findByIdAndUpdate(
                req.params.id,
                {
                    categoryid: req.body.categoryid,
                    subcategoryname: req.body.subcategoryname,
                    status: req.body.status
                },
                { new: true }
            );

            if (!updatedSubcategory) {
                return res.status(404).json({ message: "Subcategory not found" });
            }

            res.json(updatedSubcategory);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Update Status Only
module.exports.EditSubCategoryWithStatus = [
    check('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['Active', 'Deactive']).withMessage('Status must be either Active or Deactive'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedSubcategory = await Subcategory.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                { new: true }
            );

            if (!updatedSubcategory) {
                return res.status(404).json({ message: "Subcategory not found" });
            }

            res.json(updatedSubcategory);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Delete Subcategory
module.exports.DeleteSubCategory = [
    async (req, res) => {
        try {
            const subcategory = await Subcategory.findById(req.params.id);
            if (!subcategory) {
                return res.status(404).json({ message: 'Subcategory not found' });
            }

            await subcategory.deleteOne();
            res.json({ message: 'Subcategory deleted successfully' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Fetch All
module.exports.FetchSubcategory = [
    async (req, res) => {
        try {
            const subcategories = await Subcategory.find().populate('categoryid');
            res.json(subcategories);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

module.exports.FetchSubcategorywithsatusactive = [
    async (req, res) => {
        try {
            const subcategories = await Subcategory.find({ status: "Active" }).populate('categoryid');
            res.json(subcategories);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];
