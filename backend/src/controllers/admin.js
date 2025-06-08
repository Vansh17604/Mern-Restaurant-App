const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt= require("bcrypt");
const {check,validationResult}= require('express-validator');
const dotenv= require('dotenv');
dotenv.config();

module.exports.RegisterAdmin= [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    ,async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
            }
            const {name,email,password}=req.body;
            try{
                const existingAdmin= await Admin.findOne({email});
                if(existingAdmin){
                    return res.status(400).json({msg:'Admin already exists'});
                    }
                    const admin = new Admin({name,email,password});
                    await admin.save();
                    

                    const token= jwt.sign(
                        {id:admin._id, role:"Admin"},
                        process.env.JWT_SECRET_KEY,
                        {expiresIn:"1d"}       
                    );
                    res.cookie('auth_token',token,{
                        httpOnly:true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 86400000 
                    
                    });
                    res.json({msg:'Admin registered successfully'});
                    
                    
            }catch(error){
                console.error(error.message);
                res.status(500).json({msg:'Server error'});
            }
    }
]


module.exports.ChangePassword = [
    check('currentPassword').notEmpty().withMessage('Current password is required'),
    check('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;

        try {
           const admin = await Admin.findOne(); 
            if (!admin) {
                return res.status(404).json({ msg: 'Admin not found' });
            }

            const isMatch = await bcrypt.compare(currentPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Current password is incorrect' });
            }

      

            admin.password = newPassword;
            await admin.save();

            res.json({ msg: 'Password changed successfully' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
];

module.exports.UpdateAdminProfile = [
  check('name').optional().notEmpty().withMessage('Name cannot be empty'),
  check('email').optional().isEmail().withMessage('Invalid email format'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      const admin = await Admin.findById(req.params.id);
      if (!admin) return res.status(404).json({ msg: 'Admin not found' });

      if (name) admin.name = name;
      if (email) {
        const existingEmail = await Admin.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== req.params.id) {
          return res.status(400).json({ msg: 'Email already in use' });
        }
        admin.email = email;
      }

      await admin.save();
      res.json({ msg: 'Profile updated successfully', admin });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
];

module.exports.fetchAdmindetails = [
  async (req, res) => {
    try {
      const admin = await Admin.findById(req.params.id).select("-password");

      if (!admin) return res.status(404).json({ msg: "Admin not found" });
      res.json(admin);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  },
];