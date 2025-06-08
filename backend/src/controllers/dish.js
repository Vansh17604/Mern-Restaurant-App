const Dish = require('../models/dish');

const axios = require('axios');
const { check, validationResult } = require('express-validator');

module.exports.EditCurrencyAndConvertPrices = [
  check('currency')
    .notEmpty()
    .isLength({ min: 3, max: 3 })
    .withMessage('Valid 3-letter currency code required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { currency: newCurrency } = req.body;

      const allDishes = await Dish.find();
      if (allDishes.length === 0) {
        return res.status(404).json({ message: "No dishes found" });
      }
      const uniqueCurrencies = [...new Set(allDishes.map(d => d.currency || 'USD'))];
      if (uniqueCurrencies.length > 1) {
        return res.status(400).json({ message: "Inconsistent currencies found in dishes. Please standardize before conversion." });
      }

      const currentCurrency = uniqueCurrencies[0];

      if (currentCurrency === newCurrency) {
        return res.status(200).json({ message: "Currency already in desired format. No conversion done." });
      }

      // Get conversion rate
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currentCurrency}`);
      const rate = response.data.rates[newCurrency];

      if (!rate) {
        return res.status(400).json({ message: `Conversion rate for ${newCurrency} not found` });
      }

      const updatedDishes = [];

      for (let dish of allDishes) {
        dish.price = +(dish.price * rate).toFixed(2);
        dish.currency = newCurrency;
        await dish.save();
        updatedDishes.push(dish);
      }

      res.json({
        message: `Prices and currency updated from ${currentCurrency} to ${newCurrency}`,
        conversionRate: rate,
        updatedDishes
      });

    } catch (err) {
      console.error("Error updating prices and currency:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
];







// Create Dish
module.exports.CreateDish = [
  check('categoryid').notEmpty().withMessage('Category Id is required'),
  check('subcategoryid').notEmpty().withMessage('Subcategory Id is required'),
  check('dishName.en')
    .isLength({ min: 3 }).withMessage('English name must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('English name must be under 20 characters'),
  check('dishName.es')
    .isLength({ min: 3 }).withMessage('Spanish name must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('Spanish name must be under 20 characters'),
  check('price').notEmpty().withMessage('Price is required'),
  check('description.en')
    .isLength({ min: 3 }).withMessage('English description must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('English description must be under 100 characters'),
  check('description.es')
    .isLength({ min: 3 }).withMessage('Spanish description must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Spanish description must be under 100 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const existingDish = await Dish.findOne({ dishName: req.body.dishName });
    if (existingDish) return res.status(400).json({ message: 'Dish already exists' });

    if (!req.file) return res.status(400).json({ message: 'Image upload failed' });

    const imageUrl = `/uploads/dishes/${req.file.filename}`;
    const { categoryid, subcategoryid, dishName, price, description } = req.body;

    try {
      // Determine the most common currency in existing dishes
      const allDishes = await Dish.find({}, 'currency');
      const currencyCount = {};

      for (const dish of allDishes) {
        const currency = dish.currency || 'USD';
        currencyCount[currency] = (currencyCount[currency] || 0) + 1;
      }

      // Find the most common currency (fallback to USD)
      let mostCommonCurrency = 'USD';
      let maxCount = 0;

      for (const [currency, count] of Object.entries(currencyCount)) {
        if (count > maxCount) {
          mostCommonCurrency = currency;
          maxCount = count;
        }
      }

      const newDish = new Dish({
        categoryid,
        subcategoryid,
        dishName,
        price,
        currency: mostCommonCurrency,
        description,
        imageUrl
      });

      const savedDish = await newDish.save();
      res.status(201).json(savedDish);
    } catch (err) {
      console.error("Error creating dish:", err);
      res.status(500).json({ message: err.message });
    }
  }
];


// Edit Dish
module.exports.EditDish = [
  check('categoryid').notEmpty().withMessage('Category Id is required'),
  check('subcategoryid').notEmpty().withMessage('Subcategory Id is required'),
  check('dishName.en')
    .isLength({ min: 3 }).withMessage('English name must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('English name must be under 20 characters'),
  check('dishName.es')
    .isLength({ min: 3 }).withMessage('Spanish name must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('Spanish name must be under 20 characters'),
  check('price').notEmpty().withMessage('Price is required'),

  check('description.en')
    .isLength({ min: 3 }).withMessage('English description must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('English description must be under 100 characters'),
  check('description.es')
    .isLength({ min: 3 }).withMessage('Spanish description must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Spanish description must be under 100 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const imageUrl = req.file ? `/uploads/dishes/${req.file.filename}` : req.body.imageUrl;

      const updatedDish = await Dish.findByIdAndUpdate(
        req.params.id,
        {
          categoryid: req.body.categoryid,
          subcategoryid: req.body.subcategoryid,
          dishName: req.body.dishName,
          price: req.body.price,
          description: req.body.description,
          imageUrl
        },
        { new: true }
      );

      if (!updatedDish) return res.status(404).json({ message: 'Dish not found' });

      res.json(updatedDish);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

// Removed EditDishStatus — no longer needed

// Delete Dish
module.exports.DeleteDish = [
  async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.id);
      if (!dish) return res.status(404).json({ message: 'Dish not found' });

      await dish.deleteOne();
      res.json({ message: 'Dish deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

// Fetch All Dishes
module.exports.FetchDishes = [
  async (req, res) => {
    try {
      const dishes = await Dish.find()
        .populate('categoryid')
        .populate('subcategoryid');
      res.json(dishes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];


module.exports.FetchActiveDishes = [
  async (req, res) => {
    try {
      const dishes = await Dish.find()
        .populate('categoryid')
        .populate('subcategoryid');

      const filteredDishes = dishes.filter(dish =>
        dish.categoryid?.status === 'Active' &&
        dish.subcategoryid?.status === 'Active'
      );

      res.json(filteredDishes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];



