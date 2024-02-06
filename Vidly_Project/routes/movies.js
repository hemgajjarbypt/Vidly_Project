const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort('title').select('_id title genre numberInStock dailyRentalRate');
        if (movies.length === 0) {
            return res.status(400).send('Movies Not Exists in Database!');
        }
        return res.send(movies);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.get('/:title', async (req, res) => {
    try {
        const movie = await Movie.find({ title: req.params.title });
        if (movie.length === 0) {
            return res.status(400).send('Following Movie is Not Available in Database');
        }
        return res.send(movie);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const result = validateMovie(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const genre = await Genre.find({ genreName: req.body.genre.genreName });
        if (genre.length === 0) {
            return res.status(400).send('Genre Not available in Database!');
        }
        const upResult = await Movie.find({ title: req.body.title });
        if (upResult.length === 0) {
            const movie = new Movie({
                title: req.body.title,
                genre: {
                    _id: genre[0]._id,
                    genreName: genre[0].genreName
                },
                numberInStock: parseInt(req.body.numberInStock),
                dailyRentalRate: parseFloat(req.body.dailyRentalRate)
            });
            await movie.save().then((result) => result).catch((err) => err.message);
            return res.send(movie);
        }
        else {
            return res.status(400).send({ message: "You can't add the provided Movie Because it is already in the Database, try to update it." });
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.put('/:title', async (req, res) => {
    try {
        const filter = { title: req.params.title };
        const update = {
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        };
        const option = { new: true };
        const upMovie = await Movie.findOneAndUpdate(filter, update, option);
        if (!upMovie) {
            return res.status(400).send("Provided Movie is Not in the Database.");
        }
        else {
            return res.send(upMovie);
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.delete('/:title', async (req, res) => {
    try {
        const filter = { title: req.params.title };
        const option = { new: true };
        const result = await Movie.findOneAndDelete(filter, option);
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