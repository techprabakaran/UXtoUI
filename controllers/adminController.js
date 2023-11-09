const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Admin = require("../models/Admin");
const { generateToken } = require("../helper/helper");
const Joi = require('joi');


const registerAdmin = asyncHandler(async (req, res) => {
    try {
      
      const validationSchema = Joi.object({
          user_name: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          confirm_password:  Joi.string().valid(Joi.ref('password')).required(),
      });

      const { error, value } = validationSchema.validate(req.body);

      if (error) {
        return res.status(200).json({ status: false, message: error.details[0].message, data : null });
      } 

      const { user_name, email, password, confirm_password } = req.body

      // Check if admin exists
      const adminExists = await Admin.findOne({ email })

      if (adminExists) {
        return res.status(200).json({ status: false, message: "Email already taken!", data : null });
      }
      
     
      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create admin
      const admin = await Admin.create({
        user_name,
        email,
        password: hashedPassword,
        confirm_password: hashedPassword
      })

      if (admin) {
        res.status(201).json({
          _id: admin.id,
          user_name: admin.user_name,
          email: admin.email,
          token: generateToken(admin._id),
        })
      } else {
        return res.status(200).json({ status: false, message: "Invalid admin data", data : null });
      }
    } catch (error) {
      return res.status(200).json({ status: false, message: error.message, data : null });
    }
});

  const loginAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body
  
    // Check for user email
    const admin = await Admin.findOne({ email })
  
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin.id,
        email: admin.email,
        token: generateToken(admin._id),
      })
    } else {
      return res.status(200).json({ status: false, message: "Invalid Credentials", data : null });
    }
  })
  module.exports = {
    registerAdmin,
    loginAdmin
  };