const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title : {type : String, required : true},
    content : {type : String, required : true},
    imageUrl : {type : String, default : ""},
    validFrom : {type : Date, required :  true},
    validTo : {type : Date, required :  true},
    createdAt : {type : Date, default: Date.now()},
    deletedAt : {type : Date, default: null}
}, {
    timestamps :  true
});


const Banner = mongoose.model("banner", bannerSchema);
module.exports = {
    Banner
};