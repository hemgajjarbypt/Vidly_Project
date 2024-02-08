const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, genreSchema, validateGenre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.use(express.json());

//any user can see the genres
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort('genreName').select('_id genreName movieCount isAvailable');
        if (genres.length === 0) {
            return res.status(400).send('Genre is Not Exists in Database!');
        }
        return res.send(genres);
    } catch (error) {
        res.status(500).send('Something failed!');
    }
});

//any user can see the genre with title
router.get('/:genreName', async (req, res) => {
    try {
        const result = await Genre.find({ genreName: req.params.genreName });
        if (result.length === 0) {
            return res.status(400).send('Following Genre is Not Available in Database');
        }
        return res.send(_.pick(result[0], ['_id', 'genreName', 'movieCount', 'isAvailable']));
    } catch (error) {
        return res.status(500).send('Something failed!');
    }
});

//only authenticated user which are in database can create genre
router.post('/', auth, async (req, res) => {
    try {
        const result = validateGenre(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }
        const upResult = await Genre.find({ genreName: req.body.genreName });
        if (upResult.length === 0) {
            const newGenre = new Genre({
                genreName: req.body.genreName,
                movieCount: (!req.body.movieCount)? 0 : req.body.movieCount,
                isAvailable: (!req.body.isAvailable)? false : req.body.isAvailable
            });
            const resultGenre = await newGenre.save().then((result) => result).catch((err) => err.message);
            return res.send(_.pick(resultGenre, ['_id', 'genreName', 'movieCount', 'isAvailable']));
        }
        else {
            return res.status(400).send("You can't add the provided Genre Because it is already in the Database, try to update it.");
        }
    } catch (error) {
    return res.status(500).send('Something failed!');
}
});

//only authenticated user which are in database can update genre with genreName
router.put('/:genreName', auth, async (req, res) => {
    try {
        const filter = { genreName: req.params.genreName };
        const update = {
            movieCount: req.body.movieCount,
            isAvailable: req.body.isAvailable
        };
        const option = { new: true };
        const upGenre = await Genre.findOneAndUpdate(filter, update, option);
        if (!upGenre) {
            return res.status(400).send("Provided Genre is Not in the Database.");
        }
        else {
            return res.send(_.pick(upGenre, ['_id', 'genreName', 'movieCount', 'isAvailable']));
        }
    } catch (error) {
        return res.status(500).send('Something failed.');
    }
});

//only admin user which are in database can delete genre with genreName
router.delete('/:genreName', [auth, admin], async (req, res) => {
    try {
        const filter = { genreName: req.params.genreName };
        const option = { new: true };
        const result = await Genre.findOneAndDelete(filter, option);
        if (!result) {
            return res.status(400).send("Provided Genre is Not in the Database.");
        }
        else {
            return res.send(_.pick(result, ['_id', 'genreName', 'movieCount', 'isAvailable']));
        }
    }
    catch (error) {
        return res.status(500).send("something failed");
    }
});

module.exports = router;