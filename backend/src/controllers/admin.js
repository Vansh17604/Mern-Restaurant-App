const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
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
                        {expiresIn:"1h"}       
                    );
                    res.cookie('auth_token',token,{
                        httpOnly:true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 3600000
                    
                    });
                    res.json({msg:'Admin registered successfully'});
                    
                    
            }catch(error){
                console.error(error.message);
                res.status(500).json({msg:'Server error'});
            }
    }
]