// NodeJs AM2321 Temperature & Humidity Sensor library based on AM2321 library for Arduino
// The MIT License (MIT)
//
// Copyright (c) 2013 Wang Dong
'use strict';
var wpi = require("wiring-pi");
class Sensor {

    constructor() {
    	this.addr = 0xB8 >> 1;
    	this.read = 0x03;
    	this.register = 0x0B;
    	this.count = 4;
        this.buffer = new Array(6);
        this.i2c = wpi.wiringPiI2CSetup(this.addr);	
    }

    read8() {
    	return wpi.wiringPiI2CReadReg8(this.i2c, this.addr);
    }

     write(data) {
    	wpi.wiringPiI2CWriteReg8(this.i2c, this.addr, data);
    }

    readRaw() {
    	//return new Promise(function(resolve, reject) {
    	this.write(this.read);
    	this.write(this.register);
    	this.write(this.count);
    	//setTimeout(function () {
        wpi.delay(2000);
	for(var i = 0; i < 2 + this.count; ++i)
		this.buffer[i] = this.read8();

	var crc = 0;
	crc = this.read8();
	crc |= this.read8() << 8;
	console.log(crc);
			
        var crc16 = this.crc16();
	return crc == crc16;
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

    	read.humi = this.buffer[2] << 8;
    	read.humi = this.buffer[3];
    	read.temp = this.buffer[4] << 8;
    	read.temp = this.buffer[5];

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
