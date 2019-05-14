import React, { useEffect, useState } from "react";
import "./App.css";
import DataTable from "./dataTable";
import { cleanData, getFingerprint } from "./utils";
import { Helmet } from "react-helmet";

function App() {
  const [fingerprint, setFingerprint] = useState(null);
  const [ipData, setIpData] = useState(null);
  const [showReport, setShowReport] = useState(true);

  useEffect(() => {
    if (showReport) {
      fetch("https://extreme-ip-lookup.com/json")
        .then(res => res.json())
        .then(ip => Promise.all([ip, getFingerprint()]))
        .then(([ip, finger]) => {
          let f = finger
            .map(({ key, value }) => ({ [key]: value }))
            .reduce((acc, curr) => ({
              ...acc,
              ...curr
            }));

          f = cleanData(f);
          ip = cleanData(ip);

          setFingerprint(f);
          setIpData(ip);
          setShowReport(false);
        });
    }
  }, [showReport]);

  return (
    <div>
      <Helmet>
        <title>Seanky fingerprint and IP tracker | molamk</title>
        <meta
          name="description"
          content="Small React app to collect a device's fingerprint and IP address metadata"
        />
        <meta
          name="keywords"
          cpntent="fingerprint,ip-address,tracker,react,privacy"
        />
      </Helmet>
      <header>
        <section>
          <h1>Fingerprint &amp; IP tracker</h1>
          <p>
            This project is for educational purposes only. No data is being
            stored.
          </p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/molamk/fingerprint"
          >
            Check out the code on Github
          </a>
        </section>
      </header>
      {ipData && fingerprint ? (
        <div>
          <DataTable title="IP Data" data={ipData} />
          <DataTable title="Fingerprint" data={fingerprint} />
        </div>
      ) : (
        <section>
          <h2>Please wait...</h2>
        </section>
      )}
      <footer>
        <p>
          Made by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://molamk.github.io"
          >
            molamk
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
