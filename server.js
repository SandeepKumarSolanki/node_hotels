const express = require("express");
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req.body

const PORT = process.env.PORT || 3000;




app.get('/', (req, res) => {
    res.send("Welcome to my Hotel.. ")
})

//Import the Person routes Files
//Import the menu routes files
const personRoutes = require('./routes/personRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');

app.use('/person' , personRoutes);
app.use('/menu', menuItemRoutes);





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})