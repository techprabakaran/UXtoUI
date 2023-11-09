const asyncHandler = require('express-async-handler');
const { Product } = require("../models/productModel");
const Joi = require('joi');

const getAll = asyncHandler(async (req, res) => {
    try {
        let findObj = (req.params.type)? {deletedAt : null, type : req.params.type } : {deletedAt : null};
        const data = await Product.find(findObj)
        if(data.length > 0){
            return res.status(200).json({ status: true, message: "Product Found", data : data });
        }
        else {
            return res.status(200).json({ status: false, message: "No Product Found", data : [] });
        }
    } catch (error) {
        res.status(200).json({ status : false, message: error.message, data : null });
    }
});


const insertNew = asyncHandler(async (req, res) => {
    try {
        const validationSchema = Joi.object({
            name: Joi.string().required(),
            type: Joi.number().min(0).max(4).required(),
            imageUrl: Joi.string().required(),
            price: Joi.number().required(),
            offerPrice: Joi.number().required()
        });

        const { error, value } = validationSchema.validate(req.body);

        if (error) {
          return res.status(200).json({ status: false, message: error.details[0].message, data : null });
        } 

        const data = await Product.create(req.body);
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


const addRating = asyncHandler(async (req, res) => {
    try {
        const validationSchema = Joi.object({
            productId: Joi.string().required(),
            userId: Joi.string().required(),
            rating: Joi.number().min(1).max(5).required()
        });

        const { error, value } = validationSchema.validate(req.body);

        if (error) {
          return res.status(200).json({ status: false, message: error.details[0].message, data : null });
        } 

        const newLike = {
            userId: req.body.userId,
            rating: req.body.rating,
        };
        
        const data = await Product.findByIdAndUpdate(
            req.body.productId,
            { $push: { like: newLike } },
            { new: true }
        );

        if(data){
            return res.status(200).json({ status: true, message: "Added Successfully", data : data });
        }
        else {
            return res.status(200).json({ status: false, message: "Something went wrong!!!", data : null })
        }
    } catch (error) {
        res.status(200).json({ status : false, message: error.message, data : null });
    }
});


const addReview = asyncHandler(async (req, res) => {
    try {
        const validationSchema = Joi.object({
            productId: Joi.string().required(),
            userId: Joi.string().required(),
            review: Joi.string().required()
        });

        const { error, value } = validationSchema.validate(req.body);

        if (error) {
          return res.status(200).json({ status: false, message: error.details[0].message, data : null });
        } 

        const newReview = {
            userId: req.body.userId,
            review: req.body.review,
        };
        
        const data = await Product.findByIdAndUpdate(
            req.body.productId,
            { $push: { review: newReview } },
            { new: true }
        );

        if(data){
            return res.status(200).json({ status: true, message: "Added Successfully", data : data });
        }
        else {
            return res.status(200).json({ status: false, message: "Something went wrong!!!", data : null })
        }
    } catch (error) {
        res.status(200).json({ status : false, message: error.message, data : null });
    }
});

const topRated = asyncHandler(async (req, res) => {
    try {
                
        const data = await Product.aggregate([
            {
            $unwind: '$like', 
            },
            {
            $group: {
                _id: '$_id',
                productName: { $first: '$name' }, 
                price: { $first: '$price' }, 
                imageUrl: { $first: '$imageUrl' }, 
                totalRating: { $sum: '$like.rating' }, 
                countRatings: { $sum: 1 },
            },
            },
            {
            $project: {
                _id: 1,
                productName: 1,
                price: 1,
                imageUrl: 1,
                overallRating: { $divide: ['$totalRating', '$countRatings'] }, // Calculate the overall rating
            },
            },
            {
            $sort: { overallRating: -1 }, // Sort by overall rating in descending order
            },
        ]);
        if (data) {
            return res.status(200).json({ status: true, message: "Result Found", data : data });
        } else {
            return res.status(200).json({ status: false, message: "Something went wrong!!!", data : null })
        }
       
    } catch (error) {
        res.status(200).json({ status : false, message: error.message, data : null });
    }
});


const topOffer = asyncHandler(async (req, res) => {
    try {
                
        const data = await Product.aggregate([ 
            {
                $addFields: {
                  discountPercentage: {
                    $round : [
                        {
                            $multiply: [
                                { $divide: [{ $subtract: ['$price', '$offerPrice'] }, '$price'] },
                                100,
                            ],
                        },
                        2,
                    ]
                    
                  },
                },
              },
              {
                $sort: { discountPercentage: -1 }, // Sort by discount percentage in descending order
              },
        ]);
        if (data) {
            return res.status(200).json({ status: true, message: "Result Found", data : data });
        } else {
            return res.status(200).json({ status: false, message: "Something went wrong!!!", data : null })
        }
       
    } catch (error) {
        res.status(200).json({ status : false, message: error.message, data : null });
    }
});

module.exports = {
    getAll,
    insertNew,
    addRating,
    addReview,
    topRated,
    topOffer
}