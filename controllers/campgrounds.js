const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds: allCampgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash("error", "Cannot find the campground!");
        return res.redirect(`/campgrounds`);
    }
    res.render("campgrounds/edit", { campground: foundCampground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const updatedCampground = await Campground.findByIdAndUpdate(id, req.body, { new: true });
    // const addedImages = req.files.map(file => ({url: file.path, fileName: file.filename}));
    // console.log(addedImages);
    // updatedCampground.images.push(...addedImages);
    // await updatedCampground.save();
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedCampground.images.push(...imgs);
    await updatedCampground.save();
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${updatedCampground.id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    // console.log(foundCampground);
    if (!foundCampground) {
        req.flash("error", "Cannot find the campground!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground: foundCampground });
}

module.exports.createCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body);
    newCampground.author = req.user._id;
    newCampground.images = req.files.map(file => ({url: file.path, fileName: file.filename}));
    await newCampground.save();
    // console.log(newCampground);
    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${newCampground.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
}