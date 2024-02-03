const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

const genres = [{
    id: 1,
    genreName: 'Action'
}];

genres.push({ id: 2, genreName: 'Horror' });
genres.push({ id: 3, genreName: 'Comedy' });

app.get('/', (req, res) => {

    if (isEmpty(genres)) {
        return res.status(400).send('Genre is Not Exists!');
    }
    res.send('Vidly Movies Collection');
});

app.get('/api/genres/', (req, res) => {
    if (isEmpty(genres)) {
        return res.status(400).send('Genre is Not Exists!');
    }
    res.send(genres);
});

app.get('/api/genres/:name', (req, res) => {
    if (isEmpty(genres)) {
        return res.status(400).send('Genre is Not Exists!');
    }
    const result = genres.find(g => g.genreName === req.params.name);
    if (!result) {
        return res.send('Genre is Not in Collection!');
    }
    res.send(result);
});

app.post('/api/genres/', (req, res) => {
    const result = validateGenre(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    const newGenre = {
        id: genres.length + 1,
        genreName: req.body.name
    }
    genres.push(newGenre);
    res.send(newGenre);
});

app.put('/api/genres/:id', (req, res) => {
    if (isEmpty(genres)) {
        return res.status(400).send('Genre is Not Exists!');
    }
    const result = genres.find(g => g.id === parseInt(req.params.id));
    if (!result) {
        return res.send('Genre is Not in Collection!');
    }
    result.genreName = req.body.name;
    res.send(result);
});

app.delete('/api/genres/:id', (req, res) => {
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
        name: Joi.string().min(3).required()
    })
    return schema.validate(genre);
}

app.listen(3000, () => {
    console.log('Listing at port 3000');
});