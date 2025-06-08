const Kitchen= require('../models/kitchen');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const dotenv= require('dotenv');
dotenv.config();


module.exports.RegisterKitchen = [
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

    const photo = req.file ? `/uploads/profilekitchen/${req.file.filename}` : req.body.photo;

    try {
      const existingKitchen = await Kitchen.findOne({ email });
      if (existingKitchen) {
        return res.status(400).json({ msg: 'Email already exists' });
      }

      const kitchen = new Kitchen({
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

      await kitchen.save();



      res.status(201).json({ msg: "Kitchen staff registered successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Error in registering kitchen staff" });
    }
  }
];
module.exports.EditKitchen = [
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

    const kitchenId = req.params.id;
    const {
      name,
      email,
      phone,
      address,
      city,
      gender,
      dob,
      password // optional
    } = req.body;

    const photo = req.file ? `/uploads/profilekitchen/${req.file.filename}` : req.body.photo;

    try {
      const kitchen = await Kitchen.findById(kitchenId);
      if (!kitchen) {
        return res.status(404).json({ msg: 'Kitchen staff not found' });
      }

      const existingEmail = await Kitchen.findOne({ email, _id: { $ne: kitchenId } });
      if (existingEmail) {
        return res.status(400).json({ msg: 'Email already in use by another kitchen staff' });
      }

      kitchen.name = name;
      kitchen.email = email;
      kitchen.phone = phone;
      kitchen.address = address;
      kitchen.city = city;
      kitchen.gender = gender;
      kitchen.dob = dob;
      if(photo) kitchen.photo = photo;
      if (password) kitchen.password = password;

      await kitchen.save();

      res.status(200).json({ msg: 'Kitchen staff updated successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Error updating kitchen staff' });
    }
  }
];


module.exports.GetAllKitchens = async (req, res) => {
  try {
    const kitchens = await Kitchen.find();
    res.status(200).json(kitchens);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error fetching kitchen staff" });
  }
};

module.exports.DeleteKitchen = async (req, res) => {
  const { id } = req.params;
  try {
    const kitchen = await Kitchen.findById(id);
    if (!kitchen) {
      return res.status(404).json({ msg: "Kitchen staff not found" });
    }
    await kitchen.deleteOne();
    res.status(200).json({ msg: "Kitchen staff deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error deleting kitchen staff" });
  }
};

module.exports.ChangeKitchenPassword = [
  check("currentPassword").notEmpty().withMessage("Current password is required"),
  check("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters long"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { currentPassword, newPassword } = req.body;

    try {
      const kitchen = await Kitchen.findById(req.params.id);
      if (!kitchen) return res.status(404).json({ msg: "Kitchen not found" });

      const isMatch = await bcrypt.compare(currentPassword, kitchen.password);
      if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

      kitchen.password = newPassword;
      await kitchen.save();

      res.json({ msg: "Password changed successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  },
];
module.exports.UpdateKitchenProfile = [
  check("name").optional().notEmpty().withMessage("Name cannot be empty"),
  check("email").optional().isEmail().withMessage("Invalid email format"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, address, phone, gender, dob, city } = req.body;
    const photo = req.file ? `/uploads/profilekitchen/${req.file.filename}` : req.body.photo;

    try {
      const kitchen = await Kitchen.findById(req.params.id);
      if (!kitchen) return res.status(404).json({ msg: "Kitchen not found" });

      if (name) kitchen.name = name;
      if (email) {
        const existing = await Kitchen.findOne({ email });
        if (existing && existing._id.toString() !== req.params.id) {
          return res.status(400).json({ msg: "Email already in use" });
        }
        kitchen.email = email;
      }
      if (phone) kitchen.phone = phone;
      if (gender) kitchen.gender = gender;
      if (dob) kitchen.dob = dob;
      if (photo) kitchen.photo = photo;
      if (address) kitchen.address = JSON.parse(address);
      if (city) kitchen.city = JSON.parse(city);

      await kitchen.save();

      res.json({ msg: "Profile updated successfully", kitchen });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  },
];
module.exports.FetchNameandPhoto= async(req,res)=>{
  try {
    const kitchen = await Kitchen.findById(req.params.id);
    if (!kitchen) return res.status(404).json({ msg: "Kitchen not found" });
    res.json({ name: kitchen.name, photo: kitchen.photo });
  }catch(err){
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
}
module.exports.FetchKitchenDetails = async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.id).select("-password");
    if (!kitchen) return res.status(404).json({ msg: "Kitchen not found" });

    res.json(kitchen);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};



