// mongodbPing.js
//
// Minimal MongoDB Atlas connectivity check for Node.js.
//
// Install dependencies (run this once in your project folder):
//   npm install mongodb
//
// Run the script:
//   node mongodbPing.js
//
// This script tries to read the MongoDB connection string from the
// DB_URL environment variable first. If that is not set, it falls
// back to a JSON configuration file named "mongodbConfig.json" in
// the same folder as this script.
//
// Example mongodbConfig.json structure (DO NOT use real credentials
// in source control; keep them local and private):
// {
//   "DB_URL": "your-mongodb-atlas-connection-string-here"
// }

// Load environment variables from a local .env file (if present)
// so DB_URL defined there becomes available via process.env.
// This mirrors what many Node.js apps do in development.
require("dotenv").config();

const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

/**
 * Load the MongoDB connection string.
 *
 * Why: We want beginners to see that runtime configuration should come
 * from the environment first, with a simple file-based fallback for
 * local experiments.
 */
async function loadConnectionString() {
    const fromEnv = process.env.DB_URL;

    if (fromEnv && typeof fromEnv === "string" && fromEnv.trim() !== "") {
        console.log("[step] Using DB_URL from environment variables.");
        return fromEnv.trim();
    }

    console.log("[step] DB_URL not found in environment; trying mongodbConfig.json...");

    const configPath = path.join(process.cwd(), "mongodbConfig.json");

    try {
        // Read a small JSON file synchronously so beginners can see the
        // entire flow in one place without extra callbacks.
        const raw = fs.readFileSync(configPath, "utf8");
        const parsed = JSON.parse(raw);

        if (parsed && typeof parsed.DB_URL === "string" && parsed.DB_URL.trim() !== "") {
            console.log(`[step] Loaded DB_URL from ${configPath}.`);
            return parsed.DB_URL.trim();
        }

        throw new Error("DB_URL missing or empty in configuration file.");
    } catch (err) {
        // Wrap the original error so the caller understands what went wrong
        // and how to fix it, without exposing any real connection string.
        throw new Error(
            "No usable DB_URL found. Set the DB_URL environment variable " +
            "or create mongodbConfig.json with a non-empty DB_URL field. " +
            `Details: ${err.message}`
        );
    }
}

/**
 * Main connectivity check.
 *
 * Why: Keeping everything in a single async function makes the control
 * flow easier to follow: load config -> connect -> ping -> close.
 */
async function main() {
    console.log("==============================");
    console.log("MongoDB Atlas connectivity check");
    console.log("==============================\n");

    let client;

    try {
        console.log("[step] Loading MongoDB connection string...");
        const uri = await loadConnectionString();

        // Creating the client object does not talk to the server yet; it
        // just prepares the driver with your connection options.
        client = new MongoClient(uri);

        console.log("[step] Connecting to MongoDB cluster...");
        await client.connect();
        console.log("[info] Connection established.\n");

        console.log("[step] Sending lightweight ping command to the server...");
        // The 'ping' command is a cheap way to verify that the server is
        // reachable and accepting commands, without touching application data.
        await client.db("admin").command({ ping: 1 });

        console.log("\n✅ SUCCESS: MongoDB ping replied. Your application can reach the cluster.");
    } catch (error) {
        console.error("\n❌ ERROR: MongoDB connectivity check failed.");
        console.error("[reason]", error.message);
    } finally {
        // Always try to close the client so the Node.js process can exit
        // cleanly, even when something went wrong.
        if (client) {
            console.log("\n[step] Closing MongoDB connection...");
            try {
                await client.close();
                console.log("[info] Connection closed.");
            } catch (closeError) {
                console.warn("[warn] Failed to close connection cleanly:", closeError.message);
            }
        }

        console.log("\n[done] Connectivity check finished.\n");
    }
}

// Run the main function.
// Any unexpected errors that escape main will be logged here so that
// beginners see a clear message instead of a silent crash.
main().catch((unhandledError) => {
    console.error("\n❌ UNHANDLED ERROR:", unhandledError);
});
