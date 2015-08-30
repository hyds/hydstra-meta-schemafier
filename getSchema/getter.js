var getSchema = require('./getSchema.js');

process.stdin
    .pipe(getSchema())
    .pipe(process.stdout)
;
