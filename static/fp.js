window.onload = () => {
    var scriptTag = document.createElement('script');
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/1.8.1/fingerprint2.min.js';

    var implementationCode = () => {
        new Fingerprint2().get((result, components) => {
            fetch('http://localhost:3000/fp', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hash: result, fingerprint: components })
            });
        });
    };

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;
    document.body.appendChild(scriptTag);
};