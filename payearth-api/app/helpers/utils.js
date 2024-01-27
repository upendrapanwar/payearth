module.exports = getRandomString;

module.exports = getRandomInt;

module.exports = getRandomAmount;

function getRandomString(text){
	return text + Math.floor((Math.random() * 100000) + 1);
}

function getRandomInt(){
	return Math.floor((Math.random() * 100000) + 1);
}

function getRandomAmount(){
	return ((Math.random() * 100) + 1).toFixed(2);
}