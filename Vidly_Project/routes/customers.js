const { Customer, validateCustomer } = require('../models/customer');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const result = await Customer.find().sort('name').select('_id name email phone isValid');
        if (result.length === 0) {
            return res.status(400).send('Customer is Not Exists!');
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send('Something failed!');
    }
});

router.get('/:name', async (req, res) => {
    try {
        const result = await Customer.find({ name: req.params.name });
        if (result.length === 0) {
            return res.status(400).send('Following Customer is Not Available in Database');
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send('Something failed!');
    }
});

router.post('/', async (req, res) => {
    try {
        const result = validateCustomer(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }
        const upResult = await Customer.find({ email: req.body.email });
        if (upResult.length === 0) {
            const newCustomer = new Customer({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                isValid: req.body.isValid
            });
            const resultCustomer = await newCustomer.save().then((result) => result).catch((err) => err.message);

            return res.status(200).send(_.pick(resultCustomer, ['_id', 'name', 'email', 'phone', 'isValid']));
        }
        else {
            return res.status(400).send("You can't add the provided Customer Because it is already in the Database, try to update it.");
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Something failed!');
    }
});

router.put('/:email', async (req, res) => {
    try {
        const filter = { email: req.params.email };
        const update = {
            email: req.body.email,
            email: req.body.email,
            phone: req.body.phone,
            isValid: req.body.isValid
        };
        const option = { new: true };
        const upCustomer = await Customer.findOneAndUpdate(filter, update, option);
        if (!upCustomer) {
            return res.status(400).send("Provided Customer is Not in the Database.");
        }
        else {
            return res.status(200).send(_.pick(upCustomer, ['_id', 'name', 'email', 'phone', 'isValid']));
        }
    } catch (error) {
        return res.status(500).send('Something failed!');
    }
});


router.delete('/:email', async (req, res) => {
    try {
        const filter = { email: req.params.email };
        const option = { new: true };
        const result = await Customer.findOneAndDelete(filter, option);
        if (!result) {
            return res.status(400).send("Provided Customer is Not in the Database.");
        }
        else {
            return res.status(200).send(_.pick(result, ['_id', 'name', 'email', 'phone', 'isValid']));
        }
    }
    catch (error) {
        return res.status(500).send('Something failed!');
    }
});

module.exports = router;