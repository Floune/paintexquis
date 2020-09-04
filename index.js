const express = require('express')
const axios = require('axios')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
var http = require('http').createServer(app);
var ent = require('ent');
var decode = require('ent/decode');
var io = require('socket.io')(http);

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
})

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('shuffle', () => {
		//fetch data url
		axios.get(process.env.SERVER + "/shuffle").then(response => {
			io.emit("shuffle", response.data)
		}).catch(e => {
			console.log(e.response)
		})
	})

	socket.on("save", (data) => {
		let part = "";
		if (data.part === "tete") { part = 1}
		if (data.part === "corps") { part = 2}
		if (data.part === "jambes") { part = 3}

		axios.post(process.env.SERVER + "/newdrawing", {
			part: part,
			img: data.img
		}).then(res => {
			console.log(response)
		}).catch(e => {
			console.log(e)
		})
	})

});

http.listen(port, () => {
	console.log('listening on *:3000');
});