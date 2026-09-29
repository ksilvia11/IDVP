const dateFormattedET = function(stiil){
	const timeNow = new Date ();
	const dateNow = timeNow.getDate();
	const monthNow = timeNow.getMonth();
	const yearNow = timeNow.getFullYear();
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	const folkMonthNamesET = ["näärikuu", "küünlakuu", "paastukuu", "jürikuu", "lehekuu", "jaanikuu", "heinakuu", "lõikuskuu", "mihklikuu", "viinakuu", "talvekuu", "jõulukuu"];
	const valitudKuu = (stiil === 1) ? folkMonthNamesET : monthNamesET;
	return dateNow + ". " +  valitudKuu[monthNow] + " " + yearNow;
}
	function dayOfWeekET(){
	let timeNow = new Date();
	let dayNow = timeNow.getDay()
	let dayNamesET = ["Pühapäev", "Esmaspäev", "Teisipäev", "Kolmapäev", "Neljapäev", "Reede", "Laupäev"];
	return dayNamesET [dayNow];
}
const timeFormattedET = function(){
	const timeNow = new Date();
	let hourNow = timeNow.getHours();
	let minuteNow = timeNow.getMinutes();
	let secondNow = timeNow.getSeconds();
	
	if(hourNow < 10){
		hourNow = "0" + hourNow;
	}
	if(minuteNow < 10){
		minuteNow = "0" + minuteNow;
	}
	if(secondNow < 10){
		secondNow = "0" + secondNow;
	}
	//console.log(timeNow);
	return hourNow + ":" + minuteNow + ":" + secondNow;
}

// ekspordin kõik vajalikud funktsioonid koos mugavamate nimedega
module.exports = {time: timeFormattedET, date: dateFormattedET, day: dayOfWeekET};