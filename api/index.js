// api/index.js
// Vercel serverless function entry that wraps the Express app.

const app = require("../app");

module.exports = (req, res) => {
    // The Express app itself is a request handler with (req, res),
    // so we can delegate directly to it.
    return app(req, res);
};
