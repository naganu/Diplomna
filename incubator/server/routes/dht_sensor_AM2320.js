// NodeJs AM2321 Temperature & Humidity Sensor library based on AM2321 library for Arduino
// The MIT License (MIT)
//
// Copyright (c) 2013 Wang Dong
'use strict';
var wpi = require("wiring-pi");
class Sensor {

    constructor() {
    	this.addr = 0xB8 >> 1;
    	this.data = [0x03, 0x00, 0x04]
        this.count = 4;
        this.buffer = new Array(8);
    }

    openI2C() {
        this.i2c = wpi.wiringPiI2CSetup(this.addr); 
    }

    closeI2C() {
        fs.closeSync(this.i2c);
    }

    readI2C() {
    	return wpi.wiringPiI2CRead(this.i2c);
    }

     writeI2C(data) {
    	wpi.wiringPiI2CWrite(this.i2c, data);
    }

    readRaw() {
    	//return new Promise(function(resolve, reject) {
        this.openI2C();
        this.closeI2C();
        this.openI2C();
        for(var i = 0;i < 3;++i)
               this.writeI2C(this.data[i]);
    	//setTimeout(function () {
        wpi.delay(2000);
    	for(var i = 0; i < this.count + 2; ++i)
    		this.buffer[i] = this.readI2C();

    	var crc = 0;
    	crc = this.readI2C();
    	crc |= this.readI2C() << 8;
    	console.log(crc);
        this.closeI2C();
    	return crc == this.crc16();
            //});
    }

    crc16() {
    	var crc = 0xFFFF;
    	var k = 0;
    	var j = 6;
    	while(j--) {
    		crc ^= this.buffer[k++]; 
    		for(var i = 0; i < 8; ++i) {
    			if(crc & 0x01) {
                    crc >>= 1;
                    crc  ^= 0xA001; 
                }
                else crc >>= 1;
    		}
    	}
    	return crc
    }

    readData() {
    	//return new Promise(function(resolve, reject) {
    		//function data() {
	console.log(this.readRaw());
    	var read = {
    		temp: 0,
    		humi: 0
    	};

    	read.humi = (this.buffer[2] << 8) + this.buffer[3];
    	read.temp = (this.buffer[4] << 8) + this.buffer[5];

    			//resolve(read);
    		//}
    	return read;
    	//});
    }
};

var sensor = new Sensor();

/*function resolve(res) {
	console.log(res);
}

function reject() {
	console.log("error");
}
*/
console.log(sensor.readData(3));
