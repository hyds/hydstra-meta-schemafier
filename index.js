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

//leveldb
/*

var levelup = require('levelup')
var db = levelup('./db/companydb')

  var chunk = obj[i];
  
  for (objKey in chunk){
      if (!chunk.hasOwnProperty(objKey)){ continue; }

    db.put(objKey,chunk[objKey], function (err) {
      if (err) return console.log('Ooops!', err) // some kind of I/O error
      console.log('hello world')
    })
  }


*/



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
      URIoptions = 'http://' + options.host + options.path + getMastdict;
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
      // .pipe(hydstraTools.loginToGFC())
      .pipe(hydstraTools.createSchema())
      // .pipe(hydstraTools.loginToCompanyTable())
      // .pipe(hydstraTools.createTableSchemaAssociation()) // this will return the schema _id for a company-table 
      // .pipe(hydstraTools.createSchema())
      //.pipe(fs.createWriteStream(mastdictFile))

      
  })        

};
