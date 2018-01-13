# Sphere
An Express-based API that can be used to moderate your ROBLOX game remotely.


## On your VPS:
Before you can do anything you need to have Node.js and RethinkDB installed on your VPS.

1) Clone this repository into a directory on your VPS.
2) Run `npm install` to install the required dependencies.
3) Create a RethinkDB database called whatever you want (e.g. `Sphere` or `F3X`)
4) Within that database, create a table called `bans`.
5) Configure the ModSystem.js file to your likings. **Be sure to change the token and keep it to yourself! Otherwise people can access your API and start messing around with it!** Key things that you should change: TOKEN, RethinkDB database name, and port where the API is available.
6) Do `node ModSystem.js` to confirm that your API is not erroring out or anything. If you get a message returning `console.log("Listening on port 9000…");`, it probably means your API is ready to use. However, your API may or may not work if you didn't set up your tables correctly.
7) When you exit out of your SSH session, the node process running the API will shut down. To prevent that from happening you need a process manager like PM2. Install PM2 on your VPS by running `npm install pm2@latest -g`. When you have PM2 installed, run the ModSystem.js file by doing `pm2 start ModSystem.js`. Make sure that you're in the same directory as your API; otherwise, it will not work.

## In your game:

1) Clone the ModerationManager.lua script into your ServerScriptService.
2) Because the ModerationManager script uses the TryLibrary by The F3X Team, you'll have to make it a child of the script. In order to do that, copy the script from <a href="https://github.com/F3XTeam/RBX-Try-Library/tree/c42200b7db78e160777e215dbf14410a086338b3">here</a> into the the ModerationManager.lua script. 
3) Configure the ModerationManager.lua script to your likings. Change the `BaseURL` to the IP address/domain name to your server + the port number. So if your domain name is https://api.sphere.io and you're running the API on port 9000, you'd make the `BaseURL` equal to `"https://api.sphere.io:9000"`. The other thing you can change is the kick/ban message , found on line 25, that pops up on a user's screen if they've been banned.
