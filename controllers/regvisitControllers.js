const fs = require('fs').promises;
// const dateTimeET = require('../modules/dateTimeET');
const visits = require('../src/lastvisits');
const regtextRef = "public/txt/visits.txt";
const dateTimeET = require('../src/dateTimeET');


//@desc külastuste registreerimise vormi kuvamine
//@route GET /regvisit
//@access public
const regVisit = (req, res) => {
    res.render('regvisit');
};

//@desc viimaste külastuste kuvamine failist
//@route GET /lastvisit
//@access public
const lastVisit = async (req, res) => {
    try {
        // Loeme faili sisu
        const data = await fs.readFile(regtextRef, 'utf8');
        // Jagame andmed komade järgi massiiviks
        res.render('lastvisit', { splitVisit: data.split(",") });
    } catch (err) {
        console.log('Viga faili lugemisel: ' + err);
        res.render('lastvisit', { splitVisit: [] });
    }
};

//@desc külastuse salvestamine tekstifaili
//@route POST /regvisit
//@access public
const regVisitPost = async (req, res) => {
    try {
        const fileHandle = await fs.open(regtextRef, 'a');
        
        const visitsFile = await fs.open(regtextRef, 'a');
		const timeNow = dateTimeET.time();
		const dateNow = dateTimeET.date(1);

        await fileHandle.appendFile(dateNow + ',');
        await fileHandle.appendFile(timeNow + ',');
        await fileHandle.appendFile(req.body.inputName + ',');
        await fileHandle.appendFile(req.body.inputDate + ',');
        await fileHandle.appendFile(req.body.inputTime + ';\n');
        
        await fileHandle.close();
        res.render('regvisit');
    }
    catch (err) {
        console.log('Viga faili salvestamisel: ' + err);
        res.render('regvisit');
    }
};

module.exports = {
    regVisit,
    lastVisit,
    regVisitPost
}