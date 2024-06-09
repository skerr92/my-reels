# Installation and Usage Guide

Running MyReels locally is a great way to start you parts management journey as a small business. We all know that keeping track of the parts we have on hand can be difficult, so having a handy tool that can be accessed from a phone or computer browser can save time in tracking part usage.

While there are still a lot of feathers under development, you can still keep track of parts and projects now.

### Getting started ###

First enter the repo folder and run `npm install`. This should install all the project dependencies.

If you don't have `nodemon` installed, do `npm install -g nodemon`. This will install it globally. You may need to use sudo if your system requires it for global installation.

To get started, you will want to go into the `server.js` file and change you secret. There is an update coming soon to use a `local-secrets.json` file but for now, we will just define an arbitrary secret. It's not super critical at this moment.

From there, let's make sure the repo is in a place we are okay running at all times. For some, this might be a spare computer, for others it might be a Rasberry Pi. (probably something capable or running all the dependencies).

We will add in the future instructions to run in a way that pipes server logs to a prod.logfile, for now we can start the server processes by doing 

`nodemon . &` followed by moving to the `frontend` directory and running `npx http-server . &` this will allow you to still use the terminal, though it will still print out logged events and restarts. Just press enter each time you need to do something in the console.

To stop these proceses, you'll need to do `ps aux` and search for `http-server` and `nodemon` and kill those processes with `kill <process pid>`. If you have a lot of processes going, you can filter down the processes by doing `ps aux | grep -i "http-server"` and `ps aux | grep -i "nodemon"`.

From here you can access MyReels from [your browser](http://localhost:8080).

You will need to create an account which can be done by going to the [registration page](http://localhost:8080/register.html)

The registration process will be changing in the future to be interoperable with a future coming online accessible version of MyReel.

### Troubleshooting ###

If you are having issues with MyReels (there are expected to be bugs), please file an issue and we'll try to get it resolved as soon as possible.

### FAQ ###
