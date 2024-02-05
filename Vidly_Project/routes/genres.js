const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
router.use(express.json());


mongoose.connect('mongodb://localhost/vidly_project')
    .then(() => console.log('Connected to database Successfully...'))
    .catch((err) => console.log('Error While Connecting to Database!', err));

const genreSchema = mongoose.Schema({
    genreName: {
        type: String,
        required: true,
        min: 5,
        max: 20,
        enum: ['Action', 'Horror', 'Comedy', 'Biography', 'Documentary', 'Suspense', 'Thriller', 'Adventure', 'Drama'],
    },
    date: { type: Date, default: Date.now() },
    movieCount: Number,
    isAvailable: Boolean
});

const Genre = mongoose.model('Genre', genreSchema);


// const genres = [{
//     id: 1,
//     genreName: 'Action'
// }];
// genres.push({ id: 2, genreName: 'Horror' });
// genres.push({ id: 3, genreName: 'Comedy' });

router.get('/', (req, res) => {
    async function getGenres() {
        const genres = await Genre.find().sort('genreName').select('_id genreName movieCount date isAvailable');
        if (genres.length === 0) {
            return res.status(400).send('Genre is Not Exists!');
        }
        return res.send(genres);
    }
    getGenres();
});

router.get('/:genreName', (req, res) => {
    // if (isEmpty(genres)) {
    //     return res.status(400).send('Genre is Not Exists!');
    // }
    // const result = genres.find(g => g.genreName === req.params.name);
    // if (!result) {
    //     return res.send('Genre is Not in Collection!');
    // }

    try {
        async function findGenre() {
            const result = await Genre.find({ genreName: req.params.genreName });
            if (result.length === 0) {
                return res.status(400).send('Following Genre is Not Available in Database');
            }
            return res.send(result);
        }
        findGenre();
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.post('/', (req, res) => {
    try {
        async function addGenre() {
            const result = validateGenre(req.body);
            if (result.error) {
                return res.status(400).send(result.error.details[0].message);
            }
            // const newGenre = {
            //     id: genres.length + 1,
            //     genreName: req.body.name
            // }
            // genres.push(newGenre);
            const newGenre = new Genre({
                genreName: req.body.genreName,
                movieCount: parseInt(req.body.movieCount),
                isAvailable: req.body.isAvailable
            });
            const resultGenre = await newGenre.save();
            return res.send(resultGenre);
        }
        addGenre();
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.put('/:genreName', (req, res) => {
    // if (isEmpty(genres)) {
    //     return res.status(400).send('Genre is Not Exists!');
    // }
    // const result = genres.find(g => g.id === parseInt(req.params.id));
    // if (!result) {
    //     return res.send('Genre is Not in Collection!');
    // }
    // result.genreName = req.body.name;
    // res.send(result);
    try {
        async function updateGenre() {
            // async function findGenre(){
            //     const result = await Genre.find({ genreName: req.params.genreName});
            //     if (result.length === 0) {
            //         return res.status(400).send('Following Genre is Not Available in Database');
            //     }
            //     return res.send(result);
            // }
            // const genre = findGenre();
            
            const filter = { genreName: req.params.genreName };
            const update = {
                genreName: req.body.genreName,
                movieCount: req.body.movieCount,
                isAvailable: req.body.isAvailable
            };
            const option = { new: true };
    
            const upGenre = await Genre.findOneAndUpdate(filter, update, option);
    
            return res.send(upGenre);
        }
        updateGenre();
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.delete('/:id', (req, res) => {
    if (isEmpty(genres)) {
        return res.status(400).send('Genre is Not Exists!');
    }
    const result = genres.find(g => g.id === parseInt(req.params.id));
    if (!result) {
        return res.send('Genre is Not in Collection!');
    }
    const index = genres.indexOf(result);
    genres.splice(index, 1);
    res.send(result);
});


function isEmpty(genre) {
    return !genre.length > 0;
}

function validateGenre(genre) {
    const schema = Joi.object({
        genreName: Joi.string().min(3).required(),
        movieCount: Joi.number().required().min(1),
        isAvailable: Joi.boolean().required()
    })
    return schema.validate(genre);
}

module.exports = router;