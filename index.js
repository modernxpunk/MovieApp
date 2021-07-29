const express = require('express')
const path = require('path')

const app = express()

const host = "127.0.0.1"
const port = 3000

app.use(express.static(__dirname  + '/public'))

app.get('/', (req, res) => {
	  res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, host, () => {
    console.log('start')
})