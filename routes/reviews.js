const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview } = require("../middleware");
const catchAsyncError = require("../utils/CatchAsyncError");

const Campground = require("../models/campground");
const Review = require("../models/review");

// POST "/campgrounds/:id/reviews"
router.post("/", isLoggedIn, validateReview, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    const newReview = new Review(req.body);
    newReview.author = req.user;
    foundCampground.reviews.push(newReview);
    await foundCampground.save();
    await newReview.save();
    res.redirect(`/campgrounds/${id}`);
}))

// DELETE "/campgrounds/:campId/reviews/:reviewId" - Route to delete a particular review for a campground
router.delete("/:reviewId", isLoggedIn, catchAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;