const express = require('express');
const fs = require ('fs').promises;
const textRef = "public/txt/vanasonad.txt";
const regtextRef = "public/txt/visits.txt";
const visits = require('./src/lastvisits');
//moodil andmebaasiga suhtlemiseks (koos async ehk ootamise osaga)
const mysql = require('mysql2/promise')
//moodul .env keskkonnamuutujate lugemiseks
require('dotenv').config();

const dateTimeET = require("./src/dateTimeET")

const bodyparser = require('body-parser');
// + dateTimeET.day() + '</p>\n');
	//	res.write('\t<p>Kuu: ' + dateTimeET.date(1) + '</p>\n');
	//	res.write('\t<p>Kellaaeg: ' + dateTimeET.time() + '</p>\n');
	
	
//käivitan funktsiooni express() ja annan nimeks app
const app = express();
//määrame renderdusmootori: EJS
app.set('view engine', 'ejs');
//määrame avalikuna kasutatava kataloogi
app.use(express.static('public'));
//määrame vormide sisu parsimise
app.use(bodyparser.urlencoded({extended: false}));

//marsuudid
app.get('/', (req,res)=>{
	const dayNow = dateTimeET.day();
	const dateNow = dateTimeET.date(1);
	const timeNow = dateTimeET.time();
	//res.send('Express.js veeb läkski käima"');
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});


app.get('/vanasona', async (req,res)=>{
	try {
		const data = await fs.readFile(textRef, "utf8");
		let folkWisdom = data.split(";");
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	}
	catch (err) {
		console.log(err);
		res.render('vanasona', {wisdom: 'Kahjuks ei leidnud ühtegi vanasõna'});
	}
});

app.get('/kool', async (req, res)=>{
	res.render('kool');
});

app.get('/regvisit', (req,res)=>{
	res.render('regvisit');
	});
	
app.get('/lastvisit', async(req, res)=>{
	const data = await visits.visits();
	res.render('lastvisit', { splitVisit: data.split(",") });
});
	
app.post('/regvisit', async (req,res)=>{
	try {
		const visits = await fs.open(regtextRef, 'a');
		const timeNow = dateTimeET.time();
		const dateNow = dateTimeET.date(1);
		await visits.appendFile(dateNow + ',');
		await visits.appendFile(timeNow + ',');
		await visits.appendFile(req.body.inputName + ',');
		await visits.appendFile(req.body.inputDate + ',');
		await visits.appendFile(req.body.inputTime + ';\n');
		await visits.close();
		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}

	
});
	
app.get('/eestifilm', (req,res)=>{
	res.render('eestifilm');
});
	
app.get('/eestifilm/inimesed', async(req,res)=>{
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			
		});
		//defineerime SQL päringu
		let sqlReq = 'SELECT * FROM person';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilminimesed', {personList: sqlRes});
	}
	
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('eestifilminimesed', {personList:[]});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
});
app.get('/eestifilm/inimesed_lisa', (req,res)=>{
	res.render('eestifilminimesed_lisa', {notice: 'Ootan sisestust!'});
});

app.post('/eestifilm/inimesed_lisa', async(req,res)=>{
	console.log(req.body);
	//kontrollime andmeid
	//sisestatud sünnikuupäev (tekst) teisendada kuupäevaks
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();
	if(!req.body.firstNameInput || !req.body.lastNameInput|| !req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > timeNow){
		console.log("Andmed pole korrektsed!");
		return res.render('eestifilminimesed_lisa', {notice: 'Andmed on vigased!'});
	}
	let deceasedDate = null;
	if(req.body.deceasedInput !=''){
		deceasedDate = req.body.deceasedInput;
	}
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			});
			let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
			await conn.execute(sqlReq, [
				req.body.firstNameInput,
				req.body.lastNameInput,
				req.body.bornInput,
				deceasedDate
			]);
			res.render('eestifilminimesed_lisa', {notice: req.body.firstNameInput + ' ' +req.body.lastNameInput + 'Andmebaasi lisatud!'});
	}
	catch (err) {
	console.log('Viga andmebaasiga suhtlemisel: ' + err);
	res.render('eestifilminimesed_lisa', {notice: 'Tekkis viga, midagi ei salvestatud!'});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
});

app.listen(5213);