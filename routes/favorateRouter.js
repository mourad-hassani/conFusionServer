const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Favorates = require('../models/favorate');
const cors = require('./cors');

router.use(bodyParser.json());
router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorates.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then(favorate => {
                if (favorate) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorate);
                } else {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('No favorate for you');
                }
            }, err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorates.findOne({ user: req.user._id })
            .then(favorate => {
                if (req.body) {
                    if (favorate) {
                        for (let dishId of req.body) {
                            if (favorate.dishes.indexOf(dishId._id) === -1)
                                favorate.dishes.push(dishId._id);
                        }
                        favorate.save()
                            .then(favorate => {
                                Favorates.findById(favorate._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then(favorate => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorate);
                                    })
                            })
                            .catch(err => next(err));
                    } else {
                        Favorates.create({ user: req.user._id }, (err, favorate) => {
                            if (err) return next(err);
                            else {
                                if (req.body) {
                                    for (let dishId of req.body) {
                                        if (favorate.dishes.indexOf(dishId._id) === -1)
                                            favorate.dishes.push(dishId._id);
                                    }
                                    favorate.save()
                                        .then(favorate => {
                                            Favorates.findById(favorate._id)
                                                .populate('user')
                                                .populate('dishes')
                                                .then(favorate => {
                                                    res.statusCode = 200;
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.json(favorate);
                                                })
                                        })
                                        .catch(err => next(err));
                                }
                            }
                        });
                    }
                }
            }, err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorates.findOneAndRemove({ user: req.user._id }, err => {
            if (err) return next(err);
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('favorate Deleted');
            }
        });
    });

router.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorates.findOne({ user: req.user._id })
            .then(favorates => {
                if (!favorates) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({ "exists": false, "favorates": favorates });
                } else {
                    if (favorates.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({ "exists": false, "favorates": favorates })
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": true, "favorates": favorates });
                    }
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorates.findOne({ user: req.user._id })
            .then(favorate => {
                if (favorate) {
                    if (favorate.dishes.indexOf(req.params.dishId) === -1)
                        favorate.dishes.push(req.params.dishId);
                    favorate.save()
                        .then(favorate => {
                            Favorates.findById(favorate._id)
                                .populate('user')
                                .populate('dishes')
                                .then(favorate => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorate);
                                })
                        })
                        .catch(err => next(err));
                } else {
                    Favorates.create({ user: req.user._id }, (err, favorate) => {
                        if (err) return next(err);
                        else {
                            if (favorate.dishes.indexOf(req.params.dishId) === -1)
                                favorate.dishes.push(req.params.dishId);
                            favorate.save()
                                .then(favorate => {
                                    Favorates.findById(favorate._id)
                                        .populate('user')
                                        .populate('dishes')
                                        .then(favorate => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorate);
                                        })
                                })
                                .catch(err => next(err));
                        }
                    });
                }
            }, err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorates.findOne({ user: req.user._id })
            .then(favorate => {
                if (favorate) {
                    favorate.dishes.pull({ _id: req.params.dishId });
                    favorate.save()
                        .then(favorate => {
                            Favorates.findById(favorate._id)
                                .populate('user')
                                .populate('dishes')
                                .then(favorate => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorate);
                                })
                        })
                        .catch(err => next(err));
                }
            }, err => next(err));
    });


module.exports = router;