const express = require('express')
const cors = require('cors')

const fs = require('fs')

const app = express()

const port = process.env.port || 2345

app.use(cors())
app.use(express.static('/linmass/dev/Homepage/beta5/client', {

}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization', '*')
    next()
})

app.get('/links', (req, res) => {
    const data = JSON.parse(fs.readFileSync('/linmass/dev/Homepage/beta5/server/data.json'))
    res.json(data['links'])
})

app.listen(port, () => {
    console.log(`Listening on port ${port}....`)
})