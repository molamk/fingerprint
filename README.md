# How to build a fingerprint tracker?

## Goal

Write a basic tracker based on a browser's fingerprint, IP address and user agent. The tracker is very lightweight with only 70 lines of code! (180 if we want to store the [collected data](./database.js)).

## Motivation

> By gathering that information together and storing it on its own servers, a site can track your browsing habits without the use of persistent identifiers stored on your computer, like cookies. Fingerprinting can also be used to recreate a tracking cookie for a user after the user has deleted it. Users that are aware of cookies can remove them within their browser settings, but fingerprinting subverts the built-in browser mechanisms that allow users to avoid being tracked. ([EFF](https://www.eff.org/deeplinks/2018/06/gdpr-and-browser-fingerprinting-how-it-changes-game-sneakiest-web-trackers))

## Try it

```bash
# Clone the repo & install dependencies
git clone https://github.com/molamk/fingerprint
cd fingerprint && npm install

# Fire up Mongodb & the node server
mongod &
npm start

# Add the "injectable.js" script to your target page
<script src="<YOUR_SERVER_URL>/injectable.js"></script>

# Or use the "proof.html" provided
open proof.html
```

## How it works
1. The browser requests `injectable.js` from our server
1. The server serves up `injectable.js`
1. Once on the browser, `injectable.js` does the following:
    1. Extract the browser's fingerprint using [fingerprintjs2](https://github.com/Valve/fingerprintjs2)
    1. Collect the user's IP address & metadata (ex: location) from an AJAX call to [Extreme IP lookup](https://extreme-ip-lookup.com/)
    1. Sends the collected data to our server
1. Server picks up the request, then:
    1. Extract the user agent
    1. Bundle the browser's fingerprint, the user agent and IP data into an object
    1. Generate a hash of the object
    1. Tries to store the fingerprint into Mongodb. We then have two scenarios:
        1. The fingerprint is new: Store it
        1. The fingerprint is already stored: Log the domain on which it has been detected

## Tools

- [fingerprintjs2](https://github.com/Valve/fingerprintjs2)
- [express-useragent](https://github.com/biggora/express-useragent)
- [Extreme IP lookup](https://extreme-ip-lookup.com/)
