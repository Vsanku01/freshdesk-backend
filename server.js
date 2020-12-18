const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/Routes');
const moment = require('moment');
require('dotenv').config();

const app = express();

// middlewares
app.use(bodyParser.json());
app.use('/uploads', express.static('./uploads'));
app.use(cors());
app.use(routes);

const PORT = 5000 || process.env.PORT;

app.get('/', (req, res) => {
  res.json({ message: 'From the server' });
});

// database Connection
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  function (err) {
    if (err) return console.log('Error: ', err);
    console.log(
      'MongoDB Connection -- Ready State is: ',
      mongoose.connection.readyState
    );
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
