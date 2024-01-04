const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const catchAsyncError = require("../utils/CatchAsyncError");
const campgrounds = require("../controllers/campgrounds");
const multer  = require('multer');
const {storage} = require("../cloudinary/index");
const upload = multer({ storage });

//////////// All Campground Routes ////////////

router.route("/")
    // GET "/campgrounds" - Route to show home page
    .get(catchAsyncError(campgrounds.index))
    // POST "/campgrounds" - Route to insert data into database
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsyncError(campgrounds.createCampground));


// GET "/campgrounds/show" - To render form to enter new campground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// GET "/campgrounds/:id/new" - Route to show edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsyncError(campgrounds.renderEditForm));

router.route("/:id")
    // GET "/campgrounds/:id" - Route to show details of any campground
    .get(catchAsyncError(campgrounds.showCampground))
    // PUT "/campgrounds/:id" - Route to update details of any campground
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsyncError(campgrounds.updateCampground))
    // DELETE "/campgrounds/:id" - Route to delete campground data
    .delete(isLoggedIn, isAuthor, catchAsyncError(campgrounds.deleteCampground));

module.exports = router;