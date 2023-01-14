const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { readdirSync } = require('fs')
const app = express()
const mongoose = require('mongoose')
const options = {
    origin: "http://localhost:3000",
    useSuccessStatus: 200
}

dotenv.config()

app.use(express.json())
app.use(cors(options))

// app.get('*', (req, res) => {
//     res.redirect('/error');
// });
//routes
readdirSync('./routes').map((r) => app.use('/', require('./routes/' + r)))

//database
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
}).then(() => console.log('Databse Connected'))
    .catch((error) => console.log("database connection error", error))



const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log('serverrrr')
})
