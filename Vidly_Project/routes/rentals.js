const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', async (req, res) => {
    try {
        const rental = await Rental.find();
        if (rental.length === 0) {
            return res.status(400).send('Rental Not Exists in Database!');
        }
        return res.send(rental);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        // const result = validateRental(req.body);
        // if (result.error) {
        //     return res.status(400).send(result.error.details[0].message);
        // }

        // const rental = await Rental.find({ movie: req.body.movie });
        // if (genre.length === 0) {
        //     return res.status(400).send('Genre Not available in Database!');
        // }
        // const upResult = await Movie.find({ title: req.body.title });
        const customer = await Customer.find({ name: req.body.customer });
        if (!customer) {
            return res.status(400).send("Invalid Customer!");
        }
        const movie = await Movie.find({ title: req.body.movie });
        if (!movie) {
            return res.status(400).send("Invalid Movie!");
        }
        if (movie[0].numberInStock === 0) {
            return res.status(400).send("Movie not in stock.");
        }
        // if (upResult.length === 0) {
        const rental = new Rental({
            rentalFee: movie[0].dailyRentalRate * parseInt(req.body.days),
            customer: {
                _id: customer[0]._id,
                name: customer[0].name,
                phone: customer[0].phone
            },
            movie: {
                _id: movie[0]._id,
                title: movie[0].title,
                dailyRentalRate: movie[0].dailyRentalRate
            },
            dayOut: Date.now(),
        });
        await rental.save();

        movie[0].numberInStock--;
        await movie[0].save();

        return res.send(rental);
        // }
        // else {
        //     return res.status(400).send({ message: "You can't add the provided Movie Because it is already in the Database, try to update it." });
        // }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

module.exports = router;