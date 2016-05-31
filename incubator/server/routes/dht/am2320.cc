//Copyright (c) 2014 Masayuki Takagi (kamonama@gmail.com)
//Licensed under the LGPL License.
//Original code: https://github.com/takagi/am2321/blob/master/am2321.c

#include <stdlib.h>
#include <unistd.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <fcntl.h>              /* for O_RDWR */
#include <string.h>             /* for memcpy */
#include <linux/i2c-dev.h>      /* for I2C_SLAVE */
#include <node.h>
#include <wiringPi.h>

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Integer;
using v8::Value;
using v8::String;

/* I2C character device */
#define I2C_DEVICE "/dev/i2c-1" //Rasberry Pi model 2 B (0 -> 1)

/* I2C address of AM2321 sensor in 7 bits
 * - the first 7 bits should be passed to ioctl system call
 *   because the least 1 bit of the address represents read/write
 *   and the i2c driver takes care of it
 */
#define AM2321_ADDR (0xB8 >> 1)

/*
 * Removed udelay function
 */


int sys_set = wiringPiSetup();

bool _error = false;

namespace last_read {
  int tempInt = 0;
  int tempFrac = 0;
  int humiInt = 0;
  int humiFrac = 0;
}

/*
 *  CRC16
 */

unsigned short crc16( unsigned char *ptr, unsigned char len ) {
  unsigned short crc = 0xFFFF;
  unsigned char i;

  while( len-- )
  {
    crc ^= *ptr++;
    for( i = 0; i < 8; i++ ) {
      if( crc & 0x01 ) {
	crc >>= 1;
	crc ^= 0xA001;
      } else {
	crc >>= 1;
      }
    }
  }

  return crc;
}

unsigned char crc16_low( unsigned short crc ) {
  return crc & 0xFF;
}

unsigned char crc16_high( unsigned short crc ) {
  return crc >> 8;
}

/*
 *  st_am2321 Structure
 */

typedef struct {
  unsigned char data[8];
} st_am2321;

void __check_crc16( st_am2321 measured ) {
  unsigned short crc_m, crc_s;

  crc_m = crc16( measured.data, 6 );
  crc_s = (measured.data[7] << 8) + measured.data[6];
  if ( crc_m != crc_s )
    _error = true;

  return;
}

st_am2321 __st_am2321( unsigned char* data ) {
  st_am2321 result;
  memcpy( result.data, data, 8 );
  __check_crc16( result );
  return result;
}

//Removed void am2321_dump( st_am2321 measured )

// Removed all data extraction functions

struct number {
        short integer;
        short fraction;
        number(short& value): integer(value / 10), fraction(value % 10) {}
        number(): integer(0), fraction(0) {}
} typedef number;

number am2321_data(st_am2321 measured, short data) {
    short wich = 2 * data;
    short val = (measured.data[2 + wich] << 8) + measured.data[3 + wich];
    return number(val);
}

/*
 *  Measurement function
 */

st_am2321 am2321() {
  int fd;
  int ret;
  int retry_cnt;
  unsigned char data[8];

  /* open I2C device */
  fd = open( I2C_DEVICE, O_RDWR );
  if ( fd < 0 )
    _error = true;

  /* set address of I2C device in 7 bits */
  ret = ioctl( fd, I2C_SLAVE, AM2321_ADDR );
  if ( ret < 0 )
    _error = true;

 retry_cnt = 0;
 retry:

  /* wake I2C device up */
  write( fd, NULL, 0);

  /* write measurement request */
  data[0] = 0x03; data[1] = 0x00; data[2] = 0x04;
  ret = write( fd, data, 3 );
  if ( ret < 0 && retry_cnt++ < 5 ) {
    delayMicroseconds( 1000 );
    goto retry;
  }
  if ( ret < 0 )
    _error = true;

  /* wait for having measured */
  delayMicroseconds( 1500 );

  /* read measured result */
  memset( data, 0x00, 8 );
  ret = read( fd, data, 8 );
  if ( ret < 0 )
    _error = true;

  /* close I2C device */
  close( fd );

  return __st_am2321( data );
}

//Removed st_am2321 am2321_stub() returns hard-coded data

//Removed void print_am2321_human_readable( st_am2321 measured ) and  Print functions print_am2321( st_am2321 measured )- no need of them

//Removed all option related code -> no need of them

 void AM2320Object(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Local<Object> obj = Object::New(isolate);

    st_am2321 measured;

    _error = false;

    measured = am2321();

    if(!_error) {
      number temp = am2321_data(measured, 1);
      number humi = am2321_data(measured, 0);
      last_read::tempInt = temp.integer;
      last_read::tempFrac = temp.fraction;
      last_read::humiInt = humi.integer;
      last_read::humiFrac = humi.fraction;
    }

    obj->Set(String::NewFromUtf8(isolate, "tempInt"), Integer::New(args.GetIsolate(), last_read::tempInt));
    obj->Set(String::NewFromUtf8(isolate, "tempFrac"), Integer::New(args.GetIsolate(), last_read::tempFrac));
    obj->Set(String::NewFromUtf8(isolate, "humiInt"), Integer::New(args.GetIsolate(), last_read::humiInt));
    obj->Set(String::NewFromUtf8(isolate, "humiFrac"), Integer::New(args.GetIsolate(), last_read::humiFrac));

    args.GetReturnValue().Set(obj);
 }

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", AM2320Object);
}

NODE_MODULE(am2320, Init)
