// NodeJs AM2321 Temperature & Humidity Sensor library based on AM2321 library for Arduino
// The MIT License (MIT)
//
// Copyright (c) 2013 Wang Dong
'use strict';
//var wpi = require("wiring-pi");
var wpi = {}
class Sensor {

    constructor() {
    	this.addr = 0xB8 >> 1;
    	this.read = 0x03;
    	this.register = 0x0B;
    	this.count = 4;
        this.buffer = new Array(6);
        this.i2c = wpi.wiringPiI2CSetup(1);	
    }

    read() {
    	return wpi.wiringPiI2CReadReg8(this.i2c, this.addr);
    }

     write(data) {
    	wpi.wiringPiI2CWriteReg8(this.i2c, this.addr, data);
    }

    readRaw() {
    	//return new Promise(function(resolve, reject) {
    	this.write(this.read);
        console.log(read);
    	this.write(this.register);
    	this.write(this.count);
    	//setTimeout(function () {
        wpi.delay(2000);
	    for(var i = 0; i < 2 + this.count; ++i)
	    	this.buffer[i] = this.read();

		var crc = 0;
		crc = this.read();
		crc |= this.read() << 8;
			
        var crc16 = this.crc16();
		if(crc == crc16)
		    resolve();
		 else {
    		console.lo(crc, crc16);
    		reject();
        }
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
    		function data() {
    			var read = {
    				temp: 0,
    				humi: 0
    			}

    			read.humi = this.buffer[2] << 8;
    			read.humi = this.buffer[3];
    			read.temp = this.buffer[4] << 8;
    			read.temp = this.buffer[5];

    			resolve(read);
    		}
    		this.readRaw().then(data, reject);
    	//});
    }
};

var sensor = new Sensor();

function resolve(res) {
	console.log(res);
}

function reject() {
	console.log("error");
}

sensor.readData().then(resolve, reject);
