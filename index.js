const express = require('express');
const dateTimeET = require("./src/dateTimeET")
const fs = require ('fs').promises;
const textRef = "public/txt/vanasonad.txt";
const regtextRef = "public/txt/visits.txt";

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

app.get('/regivisit', (req,res)=>{
	res.render('regvisit');
	});
	
app.post('/regivisit', async (req,res)=>{
	try {
		await fs.open(regtextRef, 'a');
		await fs.appendFile(regtextRef, req.body.inputName + ';');
		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}

	});

app.listen(5213);