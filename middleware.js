const Campground = require("./models/campground");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");

// To authorize user for updating or deleting a campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    const currentUser = req.user;
    if (!foundCampground.author.equals(currentUser._id)) {
        req.flash("error", "You are not authorized to update this campground!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// To validate "campground data invalid error"
module.exports.validateCampground = (req, res, next) => {
    console.log(req.body);
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// To validate "review data invalid error"
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Please login to YelpCamp!");
        return res.redirect("/login");
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}