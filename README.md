# Sneaky fingerprint and IP tracker with React

## Introduction

The most popular tracking methods involve persistent identifiers, like famous [cookies](https://en.wikipedia.org/wiki/HTTP_cookie). But what if we delete those cookies? What if we go *incognito*?

![Hiding](https://media.giphy.com/media/3ohs7KViF6rA4aan5u/giphy.gif)

It turns out that there other ways to track users without relying on persistent identifiers. [**Browser fingerprinting**](https://en.wikipedia.org/wiki/Device_fingerprint) is one of them. Since it doesn't need to store anything, **there's nothing to delete and going *private* won't do the trick**.

We'll write a small React app to demonstrate how to collect a [device's fingerprint](https://en.wikipedia.org/wiki/Device_fingerprint) and [IP address](https://en.wikipedia.org/wiki/IP_address) metadata. The app will run entirely **in the browser**, and no data will be stored.

## Motivation

> By gathering that information together and storing it on its own servers, a site can track your browsing habits without the use of persistent identifiers stored on your computer, like cookies. Fingerprinting can also be used to recreate a tracking cookie for a user after the user has deleted it. Users that are aware of cookies can remove them within their browser settings, but fingerprinting subverts the built-in browser mechanisms that allow users to avoid being tracked. [(EFF | The GDPR and Browser Fingerprinting: How It Changes the Game for the Sneakiest Web Trackers)](https://www.eff.org/deeplinks/2018/06/gdpr-and-browser-fingerprinting-how-it-changes-game-sneakiest-web-trackers).

![Hacker](https://media.giphy.com/media/YQitE4YNQNahy/giphy.gif)

## What we're building

To build the app, we'll use:

- [Fingerprintjs2](https://github.com/Valve/fingerprintjs2) to collect the fingerprint. This will gives us the device's platform, RAM, number of cores and other juicy info.
- The [Extreme IP Lookup](https://extreme-ip-lookup.com/) API to get the IP address metadata. This provides info such as the device's location, ISP, etc...
- [React Hooks](https://reactjs.org/docs/hooks-overview.html) to manage the application's state while minimizing boilerplate. Since we're going for a light-weight approach, we'll favor this option over something like Redux.

## How it works

### Getting the device's fingerprint

`Fingerprintjs2` automatically detects the running browser's features, then selectively query the parameters that are available. Some of the identification methods it uses include:

- [Canvas fingerprinting](https://en.wikipedia.org/wiki/Canvas_fingerprinting). By drawing text and adding background colors, a script then calls the Canvas API to get a Base64 encoded representation of the binary pixel data. That representation is then turned into a hash, which will serve as a fingerprint.
- [Font detection](https://browserleaks.com/fonts). Based on what fonts you have, and how they are drawn. By measuring the dimensions of the filled, we can model a fingerprint.
- Browser plugin probing.
- Audio sampling.
- WebGL fingerprinting.

To *actually* get the fingerprint we'll use the `get` function of `Fingerprintjs2`, and it looks like this:

```js
import fp from "fingerprintjs2";

// We re-write the callback into a Promise style,
// so it plays nice with React Hooks
export const getFingerprint = () =>
  new Promise(resolve => {
    fp.get(components => {
      resolve(components);
    });
  });

```

### Getting the IP address metadata

>IP-based Geolocation is a mapping of an IP address or MAC address to the real-world geographic location of an Internet-connected computing or a mobile device. Geolocation involves mapping an IP address to the country, region (city), latitude/longitude, ISP and domain name among other useful things. [More about here](https://www.iplocation.net/).

No magic involved here. Geo-location works by simply using a pre-populated database with relevant information. There are also many free (and paid) services that do this for you, like the one we're using in this tutorial.

We'll use a standard HTTP GET request to the `extreme-ip-lookup` REST API. We'll also specify that we want `json` as the returning response format.

```js
// Standard HTTP GET using "fetch"
fetch("https://extreme-ip-lookup.com/json")
  .then(res => res.json())
```

### Creating the component

Now let's bring everything together and create our main component. Since our data fetching is asynchronous, we'll use the [`useEffect`](https://reactjs.org/docs/hooks-effect.html) hook to populate our component.

```jsx
import React, { useEffect, useState } from "react";
import { getFingerprint } from "./utils";   // The method we wrote above
import DataTable from "./dataTable";        // Custom component to render our data

function App() {
  const [fingerprint, setFingerprint] = useState(null);
  const [ipData, setIpData] = useState(null);
  const [showReport, setShowReport] = useState(true);

  useEffect(() => {
    if (showReport) {
      fetch("https://extreme-ip-lookup.com/json")           // Get the IP data
        .then(res => res.json())
        .then(ip => Promise.all([ip, getFingerprint()]))    // Get the fingerprint
        .then(([ip, fp]) => {
          setFingerprint(fp);                               // Update the state
          setIpData(ip);
          setShowReport(false);
        });
    }
  }, [showReport]);

  return (
    <div>
      {ipData && fingerprint ? (
        <div>
          <DataTable title="IP Data" data={ipData} />
          <DataTable title="Fingerprint" data={fingerprint} />
        </div>
      ) : (
        <div>
          <h2>Please wait...</h2>
        </div>
      )}
    </div>
  );
}

export default App;
```

## Notes

The app **will not store any collected info**, but we can easily change it and give it storage capabilities. We could:

- Use the [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) API to store the results in the browser.
- Send the collected data to a server that we built that will store it in a database for future use.

## Github repository

Check out the [full code here](https://github.com/molamk/fingerprint).

## Running it

```bash
git clone git@github.com:molamk/fingerprint.git
cd fingerprint

yarn install
yarn start
```

## Live Demo link

[https://fingerprint.molamk.com](https://fingerprint.molamk.com)