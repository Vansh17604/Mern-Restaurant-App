const Kitchen= require('../models/kitchen');
const jwt= require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const dotenv= require('dotenv');
dotenv.config();

module.exports.RegisterKitchen=[
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    check('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
    check('address').not().isEmpty().withMessage('Address is required'),
    check('city').not().isEmpty().withMessage('City is required'),
    check('dob').not().isEmpty().withMessage("Date of birth is required"),
    check('gender').not().isEmpty().withMessage("Gender is required"),
    check('perdaySalery').not().isEmpty().withMessage("Per Day Salery is required"),
   ,async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const {name,email,password,phone,address,city,dob,gender,perdaySalery}=req.body;
        try{
            const existingKitchen= await Kitchen.findOne({email});
            if(existingKitchen){
                return res.status(400).json({msg:'Kitchen already exists'});
                }
                const kitchen=new Kitchen({
                    name,
                    email,
                    password,
                    phone,
                    address,
                    city,
                    dob,
                    perdaySalery,
                    gender,
                    status:"Deactive"
                    });
                    await kitchen.save();

                    const token= jwt.sign({
                        id:kitchen._id,role: "Kitchen"
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '1h' }
                );
                res.cookie("auth_token",token,{
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600000
                })
                res.json({msg:'Kitchen registered successfully',token});
                
        }catch(error){
            console.error(error.message);
            res.status(500).json({msg:'Error in registration'});
        }
   }
]
