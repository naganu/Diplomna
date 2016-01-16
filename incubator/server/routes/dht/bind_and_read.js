var am2320 = require('./build/Release/am2320');

module.exports = function () {
	return new Promise(function (resolve, reject) {
		var obj = am2320();
		var temp = parseFloat(obj.tempInt + '.' + obj.tempFrac);
		var humi = parseFloat(obj.humiInt + '.' + obj.humiFrac);
		resolve({temp: temp, humi: humi});
	});
};
