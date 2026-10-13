const mysql = require('mysql2/promise')

//@description home page for Estonian Film section (edaspidi desc)
//@route GET /eestifilm
//@access public

//app.get('/eestifilm', (req,res)=>{
const eestifilm = (req, res) => {
	res.render('eestifilm');
}; 

//@desc home page for people involved in Estonian Film industry
//@route GET /eestifilm/inimesed
//@access public

//app.get('/eestifilm/inimesed', async(req,res)=>{
const inimesed = async (req, res) => {
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
};


//@desc home page for people involved in Estonian Film industry
//@route GET /eestifilm/inimesed
//@access public
//app.post('/eestifilm/filmid_add', async(req,res)=>{
const inimesedAdd = (req, res) => {
	res.render('eestifilminimesed_lisa', {notice: 'Ootan sisestust!'});
};

//@desc home page for people involved in Estonian Film industry
//@route POST /eestifilm/inimesed
//@access public
const inimesedAddPost = async(req,res)=>{
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
		deceasedDate = new Date(req.body.deceasedInput);
	}
	if(isNaN(deceacedDate.getTime()) || deceacedDate > bornDate){
		console.log('Surmakuupäev pole päris korras');
		return res.render('eestifilmiinimesed_add', {notice: 'Surmakuupäev pole päris korras!'});
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
			let deceacedDate = null;
			if(req.body.deceasedInput !=''){
				deceacedDate = req.body.deceasedInput;
			}
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
};


//@desc home page for Estonian films
//@route GET /eestifilm/eestifilmfilmid
//@access public

/* app.get('/eestifilm/eestifilmfilmid', (req,res)=>{
	res.render('eestifilmfilmid');
});
	
app.get('/eestifilm/filmid', async(req,res)=>{
	let conn;
	try {
		 */

/* const eestifilmfilmid (req, res) => { //viga siin
	res.render('eestifilmfilmid');
};  */

//app.get('/eestifilm/filmid', async(req,res)=>{
const eestifilmfilmid = async (req, res) => { // + voibolla siin
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			
		});
		//defineerime SQL päringu
		let sqlReq = 'SELECT * FROM movie ORDER BY title';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilmfilmid', {movieList: sqlRes});
	}
	
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('eestifilmfilmid', {movieList:[]});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc home page to add Estonian films
//@route POST /eestifilm/eestifilmfilmid_add
//@access public

//app.post('/eestifilm/filmid_add', async(req,res)=>{
const filmAdd = (req, res) => {
	console.log(req.body);
	//kontrollime andmeid
	res.render('eestifilmfilmid_add', {notice: 'ootan sisestust', movieTitle:null, releaseYear: null, duration: null, description: null});
};

//app.get('/eestifilm/filmid_add', (req, res) => {
/* const filmAddPost = async(req,res)=>{
    res.render('eestifilmfilmid_add', {
        notice: 'Ootan sisestust!', 
        movieTitle: null, 
        releaseYear: null, 
        duration: null, 
        description: null
    });
};
 */
//app.post('/eestifilm/filmid_add', async (req, res)=>{
const filmAddPost = async(req,res)=>{
	const now = new Date();
	const year = Number(req.body.yearInput);
	const duration = Number(req.body.durationInput);

	if(!req.body.titleInput){
		return res.render('eestifilmfilmid_add', {notice: 'filmi pealkiri puudub', movieTitle: req.body.titleInput, releaseYear: req.body.yearInput, duration: req.body.durationInput, description: req.body.descriptionInput});
	}
	if(!Number.isInteger(year) || year < 1880 || year > now.getFullYear()){
		return res.render('eestifilmfilmid_add', {notice: 'valmimisaasta on vigane', movieTitle: req.body.titleInput, releaseYear: req.body.yearInput, duration: req.body.durationInput, description: req.body.descriptionInput});
	}
	if(!Number.isInteger(duration) || duration <= 0){
		return res.render('eestifilmfilmid_add', {notice: 'kestus on vigane', movieTitle: req.body.titleInput, releaseYear: req.body.yearInput, duration: req.body.durationInput, description: req.body.descriptionInput});
	}

	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		});
		let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [req.body.titleInput, year, duration, req.body.descriptionInput || null]);
		res.render('eestifilmfilmid_add', {notice: 'Andmed salvestati', movieTitle: null, releaseYear: null, duration: null, description: null});
	}
	catch (err){
		console.log('viga andmebaasiga suhtlemisel: ' + err);
		res.render('eestifilmfilmid_add', {notice: 'andmebaasi suhtlus nurjus', movieTitle: req.body.titleInput, releaseYear: req.body.yearInput, duration: req.body.durationInput, description: req.body.descriptionInput});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc home page for professions in film industry
//@route GET /eestifilm/ametid
//@access public

//app.get('/eestifilm/ametid', async(req,res)=>{
const ametid = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			
		});
		//defineerime SQL päringu
		let sqlReq = 'SELECT * FROM profession ORDER by id';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilmametid', {professionList: sqlRes});
	}
	
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('eestifilmametid', {professionList:[]});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};


//@desc home page to add professions in film industry
//@route POST /eestifilm/ametid
//@access public

//app.get('/eestifilm/ametid_add', (req, res) => {
const ametidAdd = (req,res)=>{
    res.render('eestifilmametid_add', {
        notice: 'Ootan sisestust!',
        professionName: null,
        description: null
    });
};

//app.post('/eestifilm/ametid_add', async (req, res) => {
const ametidAddPost = async(req,res)=>{
    // Kontrollime, kas ameti nimetus on olemas
    if (!req.body.nameInput) {
        return res.render('eestifilmametid_add', {
            notice: 'Ameti nimetus on puudu!',
            professionName: req.body.nameInput,
            description: req.body.descriptionInput
        });
    }

    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
        
        let sqlReq = 'INSERT INTO profession (title, description) VALUES (?, ?)';
        await conn.execute(sqlReq, [
            req.body.nameInput, 
            req.body.descriptionInput || null
        ]);
        
        res.render('eestifilmametid_add', {
            notice: 'Amet edukalt lisatud!',
            professionName: null,
            description: null
        });
    }
    catch (err) {
        console.log('Viga andmebaasiga suhtlemisel: ' + err);
        res.render('eestifilmametid_add', {
            notice: 'Andmebaasi salvestamine ebaõnnestus!',
            professionName: req.body.nameInput,
            description: req.body.descriptionInput
        });
    }
    finally {
        if (conn) {
            await conn.end();
        }
    }
}; 

module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	eestifilmfilmid,
	filmAdd,
	filmAddPost,
	ametid,
	ametidAdd,
	ametidAddPost
}