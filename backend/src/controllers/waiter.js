const Waiter= require('../models/waiter');
const jwt= require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const dotenv= require('dotenv');
dotenv.config();


module.exports.RegisterWaiter = [
  check('name.en').notEmpty().withMessage('English name is required'),
  check('name.es').notEmpty().withMessage('Spanish name is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  check('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  check('address.en').notEmpty().withMessage('English address is required'),
  check('address.es').notEmpty().withMessage('Spanish address is required'),
  check('city.en').notEmpty().withMessage('English city is required'),
  check('city.es').notEmpty().withMessage('Spanish city is required'),
  check('dob').notEmpty().withMessage('Date of birth is required'),
  check('perdaySalery').notEmpty().withMessage('Per Day Salary is required'),
  check('otperHourSalery').notEmpty().withMessage('OT Per Hour Salary is required'),
  check('gender').notEmpty().withMessage('Gender is required'),
  

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      gender,
      dob,
      perdaySalery,
      otperHourSalery,
      
    } = req.body;
    const photo =req.file ? `/uploads/profilewaiter/${req.file.filename}` : req.body.photo;

    try {
      const existingWaiter = await Waiter.findOne({ email });
      if (existingWaiter) {
        return res.status(400).json({ msg: 'Email already exists' });
      }

      const waiter = new Waiter({
        name,
        email,
        password,
        phone,
        address,
        city,
        gender,
        dob,
        perdaySalery,
        otperHourSalery,
        photo,
        status: "Deactive"
      });

      await waiter.save();

      const token = jwt.sign(
        { id: waiter._id, role: "Waiter" },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
      });

      res.status(201).json({ msg: "Waiter registered successfully", token });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Error in registering waiter" });
    }
  }
];


module.exports.EditWaiter = [
  check('name.en').notEmpty().withMessage('English name is required'),
  check('name.es').notEmpty().withMessage('Spanish name is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  check('address.en').notEmpty().withMessage('English address is required'),
  check('address.es').notEmpty().withMessage('Spanish address is required'),
  check('city.en').notEmpty().withMessage('English city is required'),
  check('city.es').notEmpty().withMessage('Spanish city is required'),
  check('dob').notEmpty().withMessage('Date of birth is required'),
  check('perdaySalery').notEmpty().withMessage('Per Day Salary is required'),
  check('otperHourSalery').notEmpty().withMessage('OT Per Hour Salary is required'),
  check('gender').notEmpty().withMessage('Gender is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const waiterId = req.params.id;

    const {
      name,
      email,
      phone,
      address,
      city,
      gender,
      dob,
      perdaySalery,
      otperHourSalery,
      password // optional update
    } = req.body;

    const photo = req.file ? `/uploads/profilewaiter/${req.file.filename}` : req.body.photo;

    try {
      const waiter = await Waiter.findById(waiterId);
      if (!waiter) {
        return res.status(404).json({ msg: 'Waiter not found' });
      }

      const existingEmail = await Waiter.findOne({ email, _id: { $ne: waiterId } });
      if (existingEmail) {
        return res.status(400).json({ msg: 'Email already in use by another waiter' });
      }

      waiter.name = name;
      waiter.email = email;
      waiter.phone = phone;
      waiter.address = address;
      waiter.city = city;
      waiter.gender = gender;
      waiter.dob = dob;
      waiter.perdaySalery = perdaySalery;
      waiter.otperHourSalery = otperHourSalery;
      waiter.photo = photo;

        waiter.password = password;
  

      await waiter.save();

      res.status(200).json({ msg: 'Waiter updated successfully' });

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Error updating waiter' });
    }
  }
];

module.exports.GetAllWaiters = async (req, res) => {
  try {
    const waiters = await Waiter.find();
    res.status(200).json({ waiters });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error fetching waiters" });
  }
};

module.exports.DeleteWaiter = async (req, res) => {
  const { id } = req.params;

  try {
    const waiter = await Waiter.findById(id);

    if (!waiter) {
      return res.status(404).json({ msg: "Waiter not found" });
    }

    await waiter.deleteOne(); 

    res.status(200).json({ msg: "Waiter deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error deleting waiter" });
  }
};


