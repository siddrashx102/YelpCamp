// server.js
// Local development entry point.

const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`YelpCamp server listening on port ${port}...`);
});
