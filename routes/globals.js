//db connection
//
var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// custom where statement creation
// 
function where(finalWhereStatement, whereStatement) {
    if (finalWhereStatement != '') {
        return finalWhereStatement += ` AND ${whereStatement}`;
    } else {
        return ` WHERE ${whereStatement}`;
    }
}



function logQuery(query, params) {
    const db_query = pgp.as.format(query, params);
    console.log(db_query);
}

module.exports = {
    db,
    where,
    logQuery
};
