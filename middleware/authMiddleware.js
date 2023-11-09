const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin')

const adminAuth = asyncHandler(async (req, res, next) => {
  let token
  // console.log(req.headers.authorization)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]
      // console.log(token)
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await Admin.findById(decoded.id).select('-password')
      if(!req.user){
        return res.json({status: false,message : "Not authorized", data : null})
      }
      next()
    } catch (error) {
      console.log(error)
      res.json({status: false,message : "Not Authorized", data : null})
    }
  }

  if (!token) {
    res.json({status: false,message : "No Authorized Token Found", data : null})
  }
})

module.exports = { adminAuth }
