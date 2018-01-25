'use strict';

let express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),
    Repository = require('../../core/repository'),
    userRepository = new Repository('member'),
    moment = require('moment');

let error = {"status": "error", "message": "missing a parameter"};

router.get('/users', function (req, res) {
    try {
        userRepository.getAll(function (err, rows, fields) {
            if (err) {
                if (err) throw err;
            } else {
                if (rows.length) {
                    res.json(rows);
                } else {
                    res.sendStatus(404);
                }
            }
        });
    } catch (e) {
        console.log(e.message);
        res.sendStatus(404);
    }
});

router.get('/api/user/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.send(error);
    }
    try {
        userRepository.get(id, function (err, rows, fields) {
            if (err) {
                if (err) throw err;
            } else {
                if (rows.length) {
                    // return {
                    //     id: id,
                    //     name: rows[0].name,
                    //     username: rows[0].username,
                    //     birth: rows[0].birth,
                    //     active: rows[0].active,
                    // };
                    res.json(rows[0]);
                } else {
                    //throw new Error('Nothing returned!');
                    res.sendStatus(404);
                }
            }
        });
    } catch (e) {
        console.log(e.message);
        res.sendStatus(404);
    }
});

router.post('/api/user', urlencodedParser, function (req, res) {
    let name = req.body.name,
        username = req.body.username,
        password = req.body.password,
        birth = req.body.birth;

    if (!name) {
        return res.send(error);
    }

    let data = {
            id: null,
            name: name,
            username: username + Math.floor((Math.random() * 100) + 1),
            password: password,
            birth: birth,
            sign_up_token: 'random test',
            active: true,
            creation: moment().format('YYYY-MM-DD HH:mm:ss'),
            sign_up: null
        };

    userRepository.save(data, function (err, result) {
        if (err) {
            res.sendStatus(404);
        } else {
            res.sendStatus(200);
        }
    });
});

router.delete('/api/user/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.send(error);
    }
    userRepository.delete(id, function (err, result) {
        if (err) {
            res.sendStatus(404);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
