const { Genre, validateGenre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort('genreName').select('_id genreName movieCount date isAvailable');
        if (genres.length === 0) {
            return res.status(400).send('Genre is Not Exists!');
        }
        return res.send(genres);
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});

router.get('/:genreName', async (req, res) => {
    try {
        const result = await Genre.find({ genreName: req.params.genreName });
        if (result.length === 0) {
            return res.status(400).send('Following Genre is Not Available in Database');
        }
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const result = validateGenre(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }
        const upResult = await Genre.find({ genreName: req.body.genreName });
        if (upResult.length === 0) {
            const newGenre = new Genre({
                genreName: req.body.genreName,
                movieCount: parseInt(req.body.movieCount),
                isAvailable: req.body.isAvailable
            });
            const resultGenre = await newGenre.save().then((result) => result).catch((err) => err.message);
            return res.send(resultGenre);
        }
        else {
            return res.status(400).send({ message: "You can't add the provided Genre Because it is already in the Database, try to update it." });
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.put('/:genreName', async (req, res) => {
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
            return res.send(upGenre);
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.delete('/:genreName', async (req, res) => {
    try {
        const filter = { genreName: req.params.genreName };
        const option = { new: true };
        const result = await Genre.findOneAndDelete(filter, option);
        if (!result) {
            return res.status(400).send("Provided Genre is Not in the Database.");
        }
        else {
            return res.send(result);
        }
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});

module.exports = router;