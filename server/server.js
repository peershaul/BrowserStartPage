const express = require('express')
const cors = require('cors')

const fs = require('fs')

const app = express()

const port = 2500

app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization', '*')
    next()
})


app.get('/', (req, res) => {
    res.json({ message: "Hello world" })
})

app.get('/links', (req, res) => {
    const data = JSON.parse(fs.readFileSync('data.json'))
    res.json(data['links'])
})

app.listen(port, () => {
    console.log(`Listening on port ${port}....`)
})