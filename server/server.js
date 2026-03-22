require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const { requestLogger } = require('./middleware/requestLogger');
const llm = require ('./scheduler/llm');
const app = express();
const Fingerprint = require('express-fingerprint');
const cors = require('cors')

const PORT = process.env.PORT || 5001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(express.json());
app.use(Fingerprint());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true);
app.use(cors())

require('./routes')(app);

app.get('/challenge', async (req, res) => {
  try {
    // Render the challenge.ejs file
    res.render('javascript', {
    });
  } catch (error) {
    console.error('Error rendering challenge.ejs:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/', requestLogger, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(req.user, null, "\t"));
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Database connection initialized.');
});

llm();