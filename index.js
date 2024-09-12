const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Homepage Route
app.get('/', async (req, res) => {
    try {
        // const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
            const response = await axios.get('https://api.hubapi.com/crm/v3/objects/2-34405449?properties=name,nfs,nfs2,nfs3', {
            headers: { Authorization: `Bearer ${process.env.PRIVATE_APP_TOKEN}` }
        });
        res.render('homepage', { title: 'Custom Objects List', objects: response.data.results });
        // res.render('contacts', { title: 'Contacts', objects: response.data.results });
        // const data = response.data.results;
        // res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Form Route
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    try {
        const newCustomObject = {
            properties: {
                // Assuming req.body contains the relevant fields like `name`, `bio`, etc.
                name: req.body.nfs,
                nfs: req.body.nfs,
                nfs2: req.body.nfs2,
                nfs3: req.body.nfs2  // Replace with actual custom fields
            }
        };

        console.log('newCustomObject--->',newCustomObject)

        await axios.post('https://api.hubapi.com/crm/v3/objects/2-34405449', newCustomObject, {
            headers: {
                Authorization: `Bearer ${process.env.PRIVATE_APP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating custom object record');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
