//node modules
var fs = require('fs');
var https = require('https');
var http = require('http');

//npm modules
var split = require('split');
var split2 = require('split2');
var url = require('url');
var req = require('request');
var domain = require('domain'),
reqDomain = domain.create();
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "hydstra-meta-schemafier"});



//custom modules
var hydstraTools = require('hds-tools').hydstra;
var config = require('./config');
var webservices = config.services;
var getMastdict = JSON.stringify(hydstraTools.queries.mastdict);



for (var i = webservices.length - 1; i >= 0; i--) {

  var webservice = webservices[i];
  log.info('starting webservice for: ', webservice.orgcode);
  
  var userid = "";
  if (webservice.userid) { userid = webservice.userid; };
  var userid = "";
  //console.log( webservice );
  if (typeof webservice.userid !== 'undefined') { userid = webservice.userid; };
  var tables = webservice.tables;
  var orgcode = webservice.orgcode;
  var options = webservice.options;
  //console.log('host ['+options.uri+']')
  var dir = __dirname + '/mastdict/' + orgcode;
  var mastdictFile =  dir + '/mastdict.json';

  if (!fs.existsSync(dir)) {
    fs.mkdir(dir);
  }

  var uriUnparsed = 'http://' + options.host + options.path + getMastdict;
  
  if (webservice.decode){
      uri = url.parse(uriUnparsed)
      uri.path = decodeURIComponent(uri.path)
      URIoptions = {'pool':false,'keepAlive':true,'uri':uri};
  }
  else{
      URIoptions = 'http://' + options.host + options.path +'?'+ getSitesArray;
  }
  
  reqDomain.on('error', function(err) {
      log.error('Error caught in request domain: ' + err);
  });

  reqDomain.run(function() {
    log.info('requesting mastdict');

    req.get(URIoptions)
      .pipe(split2())
      .pipe(hydstraTools.cleanReturn())
      .pipe(hydstraTools.generateMetaSchema())
      .pipe(hydstraTools.createSchema())
      //.pipe(fs.createWriteStream(mastdictFile))

      
  })        

};
