# Sneaky fingerprint and IP address tracker

This is a small React app to demonstrate how to collect a [device's fingerprint](https://en.wikipedia.org/wiki/Device_fingerprint) and [IP address](https://en.wikipedia.org/wiki/IP_address) metadata. The app **runs entirely in the browser**, so **no data is being collected**. It uses:

- [Fingerprintjs2](https://github.com/Valve/fingerprintjs2) to collect the fingerprint. This will gives us the device's platform, RAM, number of cores and other juicy info.
- The [Extreme IP Lookup](https://extreme-ip-lookup.com/) API to get the IP address metadata. This provides info such as the device's location, ISP, etc...
- [React Hooks](https://reactjs.org/docs/hooks-overview.html) to manage the application's state while minimizing boilerplate. Since we're going for a light-weight approach, we'll favor this option over something like Redux.

## Demo link on [Netlify](https://www.netlify.com)

[https://fingerprint-ip-tracker.netlify.com](https://fingerprint-ip-tracker.netlify.com)

## Motivation

> By gathering that information together and storing it on its own servers, a site can track your browsing habits without the use of persistent identifiers stored on your computer, like cookies. Fingerprinting can also be used to recreate a tracking cookie for a user after the user has deleted it. Users that are aware of cookies can remove them within their browser settings, but fingerprinting subverts the built-in browser mechanisms that allow users to avoid being tracked. [(EFF | The GDPR and Browser Fingerprinting: How It Changes the Game for the Sneakiest Web Trackers)](https://www.eff.org/deeplinks/2018/06/gdpr-and-browser-fingerprinting-how-it-changes-game-sneakiest-web-trackers).

## Try it

```bash
git clone git@github.com:molamk/fingerprint.git
cd fingerprint

yarn install
yarn start
```

## How it works

### Getting the device's fingerprint

To get the fingerprint we'll use the `get` function of `Fingerprintjs2`. It will look like this

```js
import fp from "fingerprintjs2";

// We re-write the callback into a Promise style,
// this will help us plug the function more easily
// with React Hooks
export const getFingerprint = () =>
  new Promise(resolve => {
    fp.get(components => {
      resolve(components);
    });
  });

```

### Getting the IP address metadata

We'll use a standard HTTP GET request to the `extreme-ip-lookup` REST API. We'll also specify that we want `json` as the returning response format.

```js
// Standard HTTP GET using "fetch"
fetch("https://extreme-ip-lookup.com/json")
  .then(res => res.json())
```

## Note

While this app **does not store any collected info**, it would be very easy to extend it and give it storage capabilities. For that we'll only need a server that exposes an endpoint to receive the already collected data. Then the server can store the info in a database like MongoDB or other.
