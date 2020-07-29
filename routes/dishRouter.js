const express = require('express');
const bodyParser = require('body-parser');


const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Will send all the dishes to you!");
    })
    .post((req, res, next) => {
        res.end("Will add the dish: " + req.body.name +
            " with details: " + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /dishes");
    })
    .delete((req, res, next) => {
        res.end("Deleting all the dishes");
    });

dishRouter.route("/:dishId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Will send you all the info about the dish with ID: " + req.params.dishId);
    })
    .post((req, res, next) => {
        res.end("POST is not supported");
    })
    .put((req, res, next) => {
        res.end("Will update the dish with ID: " + req.params.dishId +
            " \n new dish details: " + " \n name: " + req.body.name +
            " \n description: " + req.body.description);
    })
    .delete((req, res, next) => {
        res.end("Will delete the dish with ID: " + req.params.dishId);
    });



module.exports = dishRouter;