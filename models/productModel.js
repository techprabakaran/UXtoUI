const mongoose = require('mongoose');


const ratingSchema = new mongoose.Schema({
    userId : {type : String, required : true},
    rating : { type: Number, required: true },
    createdAt : {type : Date, default: Date.now()},
    deletedAt : {type : Date, default: null}
}, {
    timestamps :  true
});


const reviewSchema = new mongoose.Schema({
    userId : {type : String, required : true},
    review : { type: String, required: true },
    createdAt : {type : Date, default: Date.now()},
    deletedAt : {type : Date, default: null}
}, {
    timestamps :  true
});

const productSchema = new mongoose.Schema({
    name : {type : String, required : true},
    type : {type : Number, default : 0, required : true}, // 0 - Power Tools, 1 - Hand Tools, 2 - Plumbing
    price : {type : Number, required : true},
    offerPrice : {type : Number, required : true},
    imageUrl : {type : String, default : ""},
    like : [ ratingSchema ],
    review : [ reviewSchema ],
    createdAt : {type : Date, default: Date.now()},
    deletedAt : {type : Date, default: null}
}, {
    timestamps :  true
});


const Product = mongoose.model("product", productSchema);
module.exports = {
    Product
};