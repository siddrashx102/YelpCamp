module.exports = function catchAsyncError(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    }
}