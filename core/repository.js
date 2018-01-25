'use strict';

let mysqlWrapper = require('./mysql-wrapper'),
    objMysql = new mysqlWrapper(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);


let Repository = function (name) {
    this.name = name;
};

Repository.prototype = {
    get: function (id, callback) {
        objMysql.query(`SELECT * FROM ${this.name} WHERE id = ?`, [id], callback);
    },
    getAll: function (callback) {
        objMysql.query(`SELECT * FROM ${this.name}`, callback);
    },
    save: function (data, callback) {
        objMysql.beginTransaction((err) => {
            if (err) { throw err; }

            objMysql.query(`INSERT INTO ${this.name} SET ?`, data, (error, results, fields) => {
                if (error) {
                    return objMysql.rollback(() => {
                        throw error;
                    });
                }

                objMysql.commit((err) => {
                    if (err) {
                        return objMysql.rollback(() => {
                            throw err;
                        });
                    }

                    callback();
                });
            });
        });
    },
    delete: function (id, callback) {
        objMysql.beginTransaction((err) => {
            if (err) { throw err; }

            objMysql.query(`DELETE FROM ${this.name} WHERE id = ?`, [id], (error, results, fields) => {
                if (error) {
                    return objMysql.rollback(() => {
                        throw error;
                    });
                }

                objMysql.commit((err) => {
                    if (err) {
                        return objMysql.rollback(() => {
                            throw err;
                        });
                    }

                    callback();
                });
            });
        });
    }
};

module.exports = Repository;
