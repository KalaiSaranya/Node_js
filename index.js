const express = require('express');
const exerciseRoutes=require('./routes/exerciseRoutes');
const userRoutes=require('./routes/userRoutes')
const errorHandler=require('./middleware/errorHandler');
const cors = require('cors')
const connectDb = require('./config/dbConnection')
require('dotenv').config()
connectDb();

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/api/users',userRoutes,exerciseRoutes);

// XMLDocument
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
