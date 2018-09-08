window.onload = () => {
    var scriptTag = document.createElement('script');
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/1.8.1/fingerprint2.min.js';

    var remoteServerURL = 'http://localhost:3000/fp';
    var implementationCode = () => {
        new Fingerprint2().get((result, components) => {
            fetch('https://extreme-ip-lookup.com/json/')
            .then(res => res.json())
            .then((fromIp) => {

                fetch(remoteServerURL, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hash: result, fingerprint: components, fromIp })
                });
            });
        });
    };

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;
    document.body.appendChild(scriptTag);
};