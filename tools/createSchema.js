var baseUrl = 'http://localhost:8081/',
    makeRequest = require('request'),
    token = '2f6b43db34b1f685c99695f85f0c0f3d'; // comes from login

// create a schema
makeRequest(
    {
        url: baseUrl + 'schemas',
        method: 'POST',
        json: {
            definition: {
                // JaySchema Object
            }
        },
        headers: {
            authorization: 'bearer ' + token
        }
    },
    function(error, response, body){
        console.log(body);
    }
);