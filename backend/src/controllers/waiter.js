const Waiter= require('../models/waiter');
const jwt= require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const dotenv= require('dotenv');
dotenv.config();

module.exports.RegisterWaiter = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  check('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  check('address.en').notEmpty().withMessage('English address is required'),
  check('address.es').notEmpty().withMessage('Spanish address is required'),
  check('city.en').notEmpty().withMessage('English city is required'),
  check('city.es').notEmpty().withMessage('Spanish city is required'),
  check('dob').notEmpty().withMessage('Date of birth is required'),
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
      dob
    } = req.body;
    
    const photo = req.file ? `/uploads/profilewaiter/${req.file.filename}` : req.body.photo;

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
        photo,
        status: "Deactive"
      });

      await waiter.save();

   

      res.status(201).json({ msg: "Waiter registered successfully"});
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Error in registering waiter" });
    }
  }
];

module.exports.EditWaiter = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  check('address.en').notEmpty().withMessage('English address is required'),
  check('address.es').notEmpty().withMessage('Spanish address is required'),
  check('city.en').notEmpty().withMessage('English city is required'),
  check('city.es').notEmpty().withMessage('Spanish city is required'),
  check('dob').notEmpty().withMessage('Date of birth is required'),
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
      password
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
      if(photo){
        waiter.photo=photo;
      }

      if (password) {
        waiter.password = password;
      }

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
    res.status(200).json( waiters );
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

module.exports.ChangeWaiterPassword = [
  check("currentPassword").notEmpty().withMessage("Current password is required"),
  check("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters long"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { currentPassword, newPassword } = req.body;

    try {
      const waiter = await Waiter.findById(req.params.id);
      if (!waiter) return res.status(404).json({ msg: "Waiter not found" });

      const isMatch = await bcrypt.compare(currentPassword, waiter.password);
      if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

      waiter.password = newPassword;
      await waiter.save();

      res.json({ msg: "Password changed successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  },
];
module.exports.UpdateWaiterProfile = [
  check("name").optional().notEmpty().withMessage("Name cannot be empty"),
  check("email").optional().isEmail().withMessage("Invalid email format"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, address, phone, gender, dob, city } = req.body;
    const photo = req.file ? `/uploads/profilewaiter/${req.file.filename}` : req.body.photo;

    try {
      const waiter = await Waiter.findById(req.params.id);
      if (!waiter) return res.status(404).json({ msg: "Waiter not found" });

      if (name) waiter.name = name;
      if (email) {
        const existing = await Waiter.findOne({ email });
        if (existing && existing._id.toString() !== req.params.id) {
          return res.status(400).json({ msg: "Email already in use" });
        }
        waiter.email = email;
      }
      if (phone) waiter.phone = phone;
      if (gender) waiter.gender = gender;
      if (dob) waiter.dob = dob;
      if (photo) waiter.photo = photo;
      if (address) waiter.address = JSON.parse(address);
      if (city) waiter.city = JSON.parse(city);

      await waiter.save();

      res.json({ msg: "Profile updated successfully", waiter });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  },
];
module.exports.FetchWaiterDetails = async (req, res) => {
  try {
    const waiter = await Waiter.findById(req.params.id).select("-password");
    if (!waiter) return res.status(404).json({ msg: "Waiter not found" });

    res.json(waiter);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
module.exports.FetchNameandPhoto= async(req,res)=>{
  try {
    const waiter = await Waiter.findById(req.params.id);
    if (!waiter) return res.status(404).json({ msg: "Waiter not found" });
    res.json({ name: waiter.name, photo: waiter.photo });
  }catch(err){
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
}



