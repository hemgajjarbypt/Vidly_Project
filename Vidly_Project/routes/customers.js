const { Customer, validateCustomer } = require('../models/customer');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const result = await Customer.find().sort('name').select('_id name phone isGold');
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
        return res.send(result);
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
        const upResult = await Customer.find({ name: req.body.name });
        if (upResult.length === 0) {
            const newCustomer = new Customer({
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold
            });
            const resultCustomer = await newCustomer.save().then((result) => result).catch((err) => err.message);

            return res.send(_.pick(resultCustomer, ['_id', 'name', 'phone', 'isGold']));
        }
        else {
            return res.status(400).send("You can't add the provided Customer Because it is already in the Database, try to update it.");
        }
    } catch (error) {
        return res.status(500).send('Something failed!');
    }
});

router.put('/:name', async (req, res) => {
    try {
        const filter = { name: req.params.name };
        const update = {
            phone: req.body.phone,
            isGold: req.body.isGold
        };
        const option = { new: true };
        const upCustomer = await Customer.findOneAndUpdate(filter, update, option);
        if (!upCustomer) {
            return res.status(400).send("Provided Customer is Not in the Database.");
        }
        else {
            return res.send(_.pick(upCustomer, ['_id', 'name', 'phone', 'isGold']));
        }
    } catch (error) {
        return res.status(500).send('Something failed!');
    }
});

router.delete('/:name', async (req, res) => {
    try {
        const filter = { name: req.params.name };
        const option = { new: true };
        const result = await Customer.findOneAndDelete(filter, option);
        if (!result) {
            return res.status(400).send("Provided Customer is Not in the Database.");
        }
        else {
            return res.send(_.pick(result, ['_id', 'name', 'phone', 'isGold']));
        }
    }
    catch (error) {
        return res.status(500).send('Something failed!');
    }
});

module.exports = router;