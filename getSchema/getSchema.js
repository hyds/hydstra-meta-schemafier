var through = require('through2').obj;
var host = process.argv[2]   || 'localhost' || '54.153.175.138';
var port = process.argv[3] || 8081 ;
var baseUrl = 'http://'+host+':'+port+'/';
var makeRequest = require('request');

module.exports = function (){
  var retrn;
  return through(function write(buffer, _, next) {
    var schema = buffer;
    try { retrn = login(schema) }
    catch(err) { return this.emit('login error',err) } 
    next();
  },
  function end(cb){
    this.push(retrn, 'utf8');
    cb();
  })
}


function login(schema){
    // Login and get a token
    console.log('loging in to ', baseUrl);
    makeRequest(
        {
            url: baseUrl + 'login',
            method: 'POST',
            json: {
                userName: 'gfc',
                password: 'gfctest'
            }
        },
        function(error, response, body){
            if (error){console.log("error: ", error)};
            var token = body.token;
            console.log('token',body);
            getSchema(token);
        }
    );
}

function getSchema(schema,token){
    var req = {
            url: baseUrl + 'schemas',
            method: 'GET',
            headers: {
                authorization: 'bearer ' + token
            }
        }; 

    makeRequest(req,function(error, response, body){
            if (error){console.log("error: ", error)};
            console.log('response body ', body);  
        }
    );
}