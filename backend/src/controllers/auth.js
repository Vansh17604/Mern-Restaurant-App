const Admin = require('../models/admin');
const Waiter= require('../models/waiter');
const Kitchen=require('../models/kitchen');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {check,validationResult}= require('express-validator');
const dotenv= require("dotenv");
dotenv.config();



module.exports.Login=[
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password').isLength({min:8}).withMessage('Password must be at least 8 characters'),
    async(req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors:errors.array()});
            }
            const {email,password}=req.body;
            try{
               let user = await Admin.findOne({ email });
               let role = '';

                if (user) {
                role = 'Admin';
                } else {
                user = await Kitchen.findOne({ email });
                if (user) {
                    role = 'Kitchen';
                } else {
                    user = await Waiter.findOne({ email });
                    if (user) {
                    role = 'Waiter';
                    }
                }
                }

                if (!user) {
                return res.status(404).json({ message: 'User not found' });
                }

                const isMatch= await bcrypt.compare(password, user.password);
                      if (!isMatch) {
                        return res.status(400).json({ msg: 'Invalid credentials' });
                      }
                      
                      const token=jwt.sign({
                        id:user._id,role
                      },
                process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                res.cookie("auth_token", token, {
                   httpOnly: true,
                   secure: process.env.NODE_ENV === 'production',
                   maxAge: 3600000 
                });
                res.json({ id:user._id,role:role, token:token });
            }
            catch(err){
                console.error(err.message);
                res.status(500).send(`${role} Login Failed`);
            }
        }
]

module.exports.validateToken = async (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    // Don't treat it as an error, just return null user
    return res.status(200).json({ msg: 'No token, user not logged in', user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    res.status(200).json({
      msg: 'Token is valid',
      user: {
        id: decoded.id,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(200).json({ msg: 'Invalid token', user: null });
  }
};


module.exports.Logout = async(req,res)=>{
    try{
    res.clearCookie("auth_token");
    res.json({msg:"Logged out successfully"});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
