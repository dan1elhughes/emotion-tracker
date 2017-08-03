const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const request = require('request');

require('dotenv').load();

app.use(express.static('public'));
app.use(bodyParser.raw({
	type: 'application/octet-stream',
	limit: '1mb',
}));

app.post('/img', (req, res) => {

	request({
		url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
		method: 'POST',
		body: req.body,
		headers: {
			'Content-Type': 'application/octet-stream',
			'Ocp-Apim-Subscription-Key': process.env.API_KEY,
		},
	},
	(err, response, body) => {
		res.json(err || body);
	});
});

app.listen(port, () => console.log(`Running on port ${port}`));
