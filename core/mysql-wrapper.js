'use strict';

let mysql = require("mysql");

let mysqlWrapper = function (hostname, username, password, database, port = 3306) {
    this.connection = mysql.createConnection({
        host: hostname,
        user: username,
        password: password,
        database: database,
        port: port,
        debug: false
    });
};

mysqlWrapper.prototype = {
    query: function (query, values, callback) {
        this.connection.query(query, values, callback);
    },
    beginTransaction: function (options, callback) {
        this.connection.beginTransaction(options, callback);
    },
    commit: function (options, callback) {
        this.connection.commit(options, callback);
    },
    rollback: function (options, callback) {
        this.connection.rollback(options, callback);
    }
};

module.exports = mysqlWrapper;
