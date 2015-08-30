var levelup = require('levelup');
var db = levelup('./tableSchemas');

   db.get('data', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found 
 
    console.log('name=' + value)
  })