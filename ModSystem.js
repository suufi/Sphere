/*
*   @file ModSystem.js
*   @author suufi (Qxest)
*   @description Generates the API using Express.js for the Moderation System used by Sphere
*/

// Token
const TOKEN = "tokomoki";

// Imports
const roblox = require("roblox-js");
const r = require("rethinkdbdash")({
        db: "F3X"
});

// Express
const express = require("express");
const app = express();
const bans = express();
const bodyParser = require("body-parser");

// Middleware
app.use(bodyParser.json());

// Routes

/*
*   GET /bans
*   Body none
*
*   Return back "Ban system!" when user visits /bans
*/
bans.get("/", (req, res) => {
    return res.send("Ban system!");
});

/*
*   POST /bans/ban
*   Body userId, admin, reason, token
*
*   Creates a document in the bans table containing the user being banned,
*   the admin that banned them, the reason that they were banned, and the
*   token used for verifying that the request is genuine.
*/
bans.post("/ban", async (req, res) => {

        // Check if all body parameters have been provided
        if (req.body.userId && req.body.admin && req.body.reason && req.body.token === TOKEN) {

                // Get the user being banned's username
                var username = await roblox.getUsernameFromId(req.body.userId);

                // Query the ban table for the userId provided
                r.table("bans").getAll(parseInt(req.body.userId), {index: "userId"}).then(bans => {

                        // Check if user is not already banned
                        if (bans.length === 0) {

                                // Insert to the bans table
                                r.table("bans").insert({
                                        userId: req.body.userId,
                                        username: username,
                                        admin: req.body.admin,
                                        reason: req.body.reason,
                                        timestamp: r.now()
                                }).run().then(() => {
                                        return res.send("The user has been banned.");
                                });

                        } else {
                                // Respond back that the person is already banned.
                                return res.send("User is already banned.");

                        }
                }).catch(console.error);

        } else {

            res.sendStatus(400);

        }

});

/*
*   DELETE /bans/ban
*   Body userId, token
*
*   Deletes the document previously created, if it exists, that refers
*   to a banned user allowing the user to be unbanned in-game.
*/
bans.delete("/ban", (req, res) => {

        // Check if all body parameters have been provided
        if (req.body.userId && req.body.token === TOKEN) {

                // Query the ban table for the userId provided
                r.table("bans").getAll(parseInt(req.body.userId), {index: "userId"}).then(ban => {

                        // Check if user is banned
                        if (ban.length === 1) {

                                // Get and delete the document from bans table
                                r.table("bans").get(ban[0].id).delete().run().then(() => {

                                        // Respond back that the person is already banned.
                                        return res.send("The user has been unbanned.");

                                }).catch(console.error);

                        } else {

                                // Respond back that the user is not banned
                                return res.send("The user is currently not banned.");

                        }
                }).catch(console.error);

        } else {
            res.sendStatus(400);
        }
});

/*
*   GET /bans/check/:userId
*   Body token
*
*   Returns an object if the user is banned, otherwise return false.
*/
bans.get("/check/:userId", (req, res) => {

        // Check if all body parameters have been provided
        if (req.params.userId && req.body.token === TOKEN) {

                // Query the ban table for the userId provided
                r.table("bans").getAll(parseInt(req.params.userId), {index: "userId"}).then(ban => {
                        
                    // Check if user is banned
                    if (ban.length === 1) {
                            // Return the ban object
                            return res.send(ban);
                    } else {
                            // Otherwise return false
                            return res.send(false);
                    }
                }).catch(console.error);
                
            } else {
                res.sendStatus(400);
        }
});

/*
*   POST /bans/check/users
*   Body [Array userIDs]
*
*   Returns an object if the user is banned, otherwise return false.
*/
bans.post('/check/users', (req, res) => {

    // Check if body was provided
    if (!req.body) return res.sendStatus(400);

    // Push the promise that gets the username of the user from their ID to jobs
    var jobs = [];
    for (var index in req.body) {
        jobs.push(roblox.getUsernameFromId(req.body[index]));
    }
    
    // Output to the console the users currently in the server
    Promise.all(jobs).then(res => console.log('Users in server:', res));
    
    // Query the bans table with the userIds from req.body
    r.table('bans').getAll(r.args(req.body), {index: 'userId'})('userId').run().then(result => {
        
        // Return back the results
        return res.send(result);

    }).catch(console.error);

});

// Route /bans to the bans instance of express
app.use('/bans', bans);

// Listen on port 9000
app.listen(9000);
console.log('Listening on port 9000…');

// Handle on unhandledRejections
process.on('unhandledRejection', err => console.error(`Uncaught Promise Error: \n${err.stack}`));