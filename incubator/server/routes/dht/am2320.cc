//Copyright (c) 2014 Masayuki Takagi (kamonama@gmail.com)
//Licensed under the LGPL License.

#include <wiringPi.h>
#include <unistd.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <stdlib.h>
#include <stdio.h>
#include <fcntl.h>              /* for O_RDWR */
#include <string.h>             /* for memcpy */
#include <linux/i2c-dev.h>      /* for I2C_SLAVE */
#include <node.h>

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
  if ( crc_m != crc_s ) {
    fprintf( stderr, "am2321: CRC16 does not match\n" );
    exit( 1 );
  }
  
  return;
}

st_am2321 __st_am2321( unsigned char* data ) {
  st_am2321 result;
  memcpy( result.data, data, 8 );
  __check_crc16( result );
  return result;
}

//Removed void am2321_dump( st_am2321 measured )

short __am2321_temperature( st_am2321 measured ) {
  return (measured.data[4] << 8) + measured.data[5];
}

short am2321_temperature_integral( st_am2321 measured ) {
  return __am2321_temperature( measured ) / 10;
}

short am2321_temperature_fraction( st_am2321 measured ) {
  return __am2321_temperature( measured ) % 10;
}

short __am2321_humidity( st_am2321 measured ) {
  return (measured.data[2] << 8) + measured.data[3];
}

short am2321_humidity_integral( st_am2321 measured ) {
  return __am2321_humidity( measured ) / 10;
}

short am2321_humidity_fraction( st_am2321 measured ) {
  return __am2321_humidity( measured ) % 10;
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
  if ( fd < 0 ) {
    perror( "am2321(1)" );
    exit( 1 );
  }

  /* set address of I2C device in 7 bits */
  ret = ioctl( fd, I2C_SLAVE, AM2321_ADDR );
  if ( ret < 0 ) {
    perror( "am2321(2)" );
    exit( 2 );
  }
 
 retry_cnt = 0;
 retry:
  
  /* wake I2C device up */
  write( fd, NULL, 0);
  
  /* write measurement request */
  data[0] = 0x03; data[1] = 0x00; data[2] = 0x04;
  ret = write( fd, data, 3 );
  if ( ret < 0 && retry_cnt++ < 5 ) {
    fprintf( stderr, "am2321: retry\n" );
    delayMicroseconds( 1000 );
    goto retry;
  }
  if ( ret < 0 ) {
    perror( "am2321(3)" );
    exit( 3 );
  }
  
  /* wait for having measured */
  delayMicroseconds( 1500 );
  
  /* read measured result */
  memset( data, 0x00, 8 );
  ret = read( fd, data, 8 );
  if ( ret < 0 ) {
    perror( "am2321(4)" );
    exit( 4 );
  }
  
  /* close I2C device */
  close( fd );
  
  return __st_am2321( data );
}

//Removed st_am2321 am2321_stub() returns hard-coded data

/*
 *  Print functions
 */

void print_am2321( st_am2321 measured ) {
  printf( "%d.%d %d.%d\n",
          am2321_temperature_integral( measured ),
          am2321_temperature_fraction( measured ),
          am2321_humidity_integral( measured ),
          am2321_humidity_fraction( measured ) );
  return;
}

//Removed *void print_am2321_human_readable( st_am2321 measured ) - non human readable is easer to parse


/*
 *  Main
 */

 //Removed all option related code -> no need of them


 void AM2320Object(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Local<Object> obj = Object::New(isolate);

    st_am2321 measured = am2321();

    obj->Set(String::NewFromUtf8(isolate, "tempInt"), Integer::New(args.GetIsolate(), am2321_temperature_integral(measured)));
    obj->Set(String::NewFromUtf8(isolate, "tempFrac"), Integer::New(args.GetIsolate(), am2321_temperature_fraction(measured)));
    obj->Set(String::NewFromUtf8(isolate, "humiInt"), Integer::New(args.GetIsolate(), am2321_humidity_integral(measured)));
    obj->Set(String::NewFromUtf8(isolate, "humiFrac"), Integer::New(args.GetIsolate(), am2321_humidity_fraction(measured)));

    args.GetReturnValue().Set(obj);
 }

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", AM2320Object);
}

NODE_MODULE(am2320, Init)
