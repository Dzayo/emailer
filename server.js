const express = require("express");
const cors = require("cors");
const app = express();
const emailer = require("./emailer");
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(express.json());
app.use(cors({origin: process.env.CORS_ORIGIN}));

const PORT = process.env.PORT || 3000;

app.post('/send', (req, res) => {
	console.log(`POST request from: ${req.get('origin')}`);
	emailer.sendEmail(req.body)
	.then((response) => res.send(response))
	.catch((error) => res.send(error.message));
});

app.listen(PORT, () => console.log(`Listening on PORT: ${ PORT }`));