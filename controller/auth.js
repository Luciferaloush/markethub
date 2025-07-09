const errorHandler = require("../utils/error_handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require("../model/users");
const crypto = require('crypto');
const Subscription = require("../model/subscription");
const SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'asdxasdxajtdmwajtdmw';
const JWT_SECRET_Admin = process.env.JWT_SECRET_Admin || 'asdxasdx0933';
const register = errorHandler(async (req, res) => {
          const { name, email, password, role} = req.body;
if (!name || !email || !password) {
        return res.status(400).send({ 
            message: "invalid request"
        });
    }
 const existing = await Users.findOne({ email });
    if (existing) {
        return res.status(400).send({ 
          message: 'Email Already Exists',
         });
    }
    const hashedPassword = await bcrypt.hash(password, SALT);
    const image = req.files?.image?.[0]?.path || null;
    const user = new Users({
        image,
        name,
        email,
        password: hashedPassword,
        role
       });
    await user.save();
    const subscription = new Subscription({
        userId: user._id,
        plan: 'free',
        productLimit: 3
    });
    await subscription.save();
    user.subscription = subscription._id;
    await user.save();
    const token = jwt.sign(
        {id: user._id},
        role === 'admin' ? JWT_SECRET_Admin : JWT_SECRET
    );
    user.password = undefined;
    
    res.status(200).json({
            message: 'Registration Success', 
           token,
             ...user._doc
           });

});
const login = errorHandler(async (req, res) => {
          const { email,  password} = req.body;
if ( !email || !password) {
        return res.status(400).send({ 
            message: "invalid request"
        });
    }
    const user = await Users.findOne({ email });
    if (!user) {
        return res.status(400).send({ 
          message: 'Email Not Found',
         });
    }
     const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send({ 
          message: 'Invalid Password'
         });
    }
    let token;
         token = jwt.sign({ id: user._id }, JWT_SECRET);

    
     res.status(200).json({
        message: 'Login Success',
        token,
    _id: user._id,
    name: user.name,
    type: user.type
    });

});


module.exports = {
          register,
          login,
          
}