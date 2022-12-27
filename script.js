const cheerio = require("cheerio");
const url = 'https://sport.wp.st-andrews.ac.uk/';
var fs = require('fs');
const d = new Date();
const e = new Date(d);

var occupancyVal;



const fetchOccupancy = async() => {
	try {
		const response = await fetch(url);
		const body = await response.text();
		
		let $ = cheerio.load(body);
		
		let occupancy = $('div > h3:first');
		return occupancy.text();
	} catch (error) {
		throw error;
	}
};

function extractOccupancy(str) {
	const occupancyNumber = str.substring(str.indexOf(':') + 2, str.indexOf("%"));
	return occupancyNumber;
}

function appendOccupancy(occ) {
	let occJSON = fs.readFileSync("occupancy.json", "utf-8");
	let occStr = JSON.parse(occJSON);

	let date = d.toISOString().split('T')[0];
	let day = d.getDay();
	let time = e - d.setHours(0, 0, 0, 0);
	
	console.log(date);
	console.log(day);
	console.log(time);

	entry = {
		"date": date,
		"day": day,
		"time_ms": time,
		"occupancy": occ 
	}

	occStr.push(entry);
	occJSON = JSON.stringify(occStr);
	fs.writeFileSync("occupancy.json", occJSON, "utf-8");
}

// fetchOccupancy().then((occupancy) => console.log(occupancy));
fetchOccupancy().then((occupancy) => {
	console.log(occupancy);
	occupancyVal = extractOccupancy(occupancy);
	console.log(occupancyVal);
	appendOccupancy(occupancyVal);
});
