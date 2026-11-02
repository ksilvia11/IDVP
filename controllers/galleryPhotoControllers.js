const mysql = require('mysql2/promise');
const galleryGet = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		
		// Päring fotodele, mille privaatsus on suurem või võrdne 2-ga
		const sql = 'SELECT filename, alttext FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL ORDER BY id DESC';
		const [rows] = await conn.execute(sql, [2]);
		
		res.render('galleryphoto', { photos: rows });
	} catch (err) {
		console.log('Viga galerii laadimisel: ' + err);
		res.render('galleryphoto', { photos: [] });
	} finally {
		if (conn) await conn.end();
	}
};

module.exports = {
    // ... sinu teised eksportridad
    galleryGet
};