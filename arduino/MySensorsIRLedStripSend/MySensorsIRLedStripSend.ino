#define MY_RADIO_NRF24
#define MY_NODE_ID 8

#include <SPI.h>
#include <MySensors.h>
#include <IRremote.h>

#define CHILD_ID_LED_STRIP 6

IRsend irsend;

long ledArr[] = {
  0xF700FF,
  0xF7807F,
  0xF740BF,
  0xF7C03F,
  0xF720DF,
  0xF7A05F,
  0xF7609F,
  0xF7E01F,
  0xF710EF,
  0xF7906F,
  0xF750AF,
  0xF7D02F,
  0xF730CF,
  0xF7B04F,
  0xF7708F,
  0xF7F00F,
  0xF708F7,
  0xF78877,
  0xF748B7,
  0xF7C837,
  0xF728D7,
  0xF7A857,
  0xF76897,
  0xF7E817
};

void setup() {
}

void presentation() {
  sendSketchInfo("LED Strip", "2.0");

  present(CHILD_ID_LED_STRIP, S_IR);
}

void loop() {
}

void receive(const MyMessage &message) {
  if (message.sensor == CHILD_ID_LED_STRIP) {
    irsend.sendNEC(ledArr[message.getInt()], 32);
    delay(40);
  }
}
