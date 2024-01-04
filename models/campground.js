const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("../models/review");

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [
        {
            url: String,
            fileName: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

CampgroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
})

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;