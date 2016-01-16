var spawnSync = require('child_process').spawnSync;

var spawn = require('child_process').spawn;

var gcc = spawnSync("gcc", ["-o", "dht", "./read_AM2320.c"]);

module.exports = function() {
	return new Promise (function(resolve, reject) {
		var dht = spawn("./dht", []);

		var result = "";

		var temp;
		var humi;

		dht.stdout.on('data', function (data) {
		  result += data;
		});

		dht.stderr.on('data', function (data) {
		  reject(new Error("sensor"));
		});

		dht.on('close', function () {
		  var ret = result.split(" ");
		  temp = parseFloat(ret[0]);
		  humi = parseFloat(ret[1]);
		  resolve({temp: temp, humi: humi});
		});
	});
}

/*read().then(function(data) {
	console.log(data.temp, data.humi);
});*/
