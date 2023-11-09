const asyncHandler = require('express-async-handler');
const { Banner } = require("../models/bannerModel");
const Joi = require('joi');


const getAll = asyncHandler(async (req, res) => {
    try {
        const data = await Banner.find({deletedAt : null})
        if(data.length > 0){
            return res.status(200).json({ status: true, message: "Banners Found", data : data });
        }
        else {
            return res.status(200).json({ status: false, message: "No Banners Found", data : [] });
        }
    } catch (error) {
        res.status(200).json({ status : false, message: error.message, data : null });
    }
});



const insertNew = asyncHandler(async (req, res) => {
    try {
        const validationSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            imageUrl: Joi.string().required(),
            validFrom:  Joi.date().iso().min('now').required(),
            validTo: Joi.date().iso().min('now').greater(Joi.ref('validFrom')).required(),
        });

        const { error, value } = validationSchema.validate(req.body);

        if (error) {
          return res.status(200).json({ status: false, message: error.details[0].message, data : null });
        } 

        const data = await Banner.create(req.body);
        if(data){
            return res.status(200).json({ status: true, message: "Added Successfully", data : data });
        }
        else {
            return res.status(200).json({ status: false, message: "Something went wrong!!!", data : data })
        }
    } catch (error) {
        res.status(200).json({ status : false, message: error.message, data : null });
    }
});


module.exports = {
    getAll,
    insertNew
}