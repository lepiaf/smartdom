#include <IRremote.h>
#include <MySensor.h>
#include <SPI.h>

#define NODE_ID 3

#define CHILD_ID_TV 1
#define CHILD_ID_HIFI 2
#define CHILD_ID_BBOX 3
#define CHILD_ID_BLURAY 4
#define CHILD_ID_HDMI 5

IRsend irsend;

MySensor gw;

long hdmiArr[] = {
  0x40BF609F, //1
  0x40BF50AF, //2
  0x40BF708F, //3
  0x40BF906F, //4
  0x40BFB04F  //5
};

long tvArr[] = {
  0xE0E040BF,
  0xE0E0807F,
  0xE0E0F00F,
  0xE0E020DF,
  0xE0E0A05F,
  0xE0E0609F,
  0xE0E010EF,
  0xE0E0906F,
  0xE0E050AF,
  0xE0E030CF,
  0xE0E0B04F,
  0xE0E0708F,
  0xE0E08877,
  0xE0E034CB,
  0xE0E0C837,
  0xE0E0E01F,
  0xE0E0D02F,
  0xE0E048B7,
  0xE0E008F7,
  0xE0E0D629,
  0xE0E058A7,
  0xE0E031CE,
  0xE0E0F20D,
  0xE0E0F807,
  0xE0E0D22D,
  0xE0E006F9,
  0xE0E0A659,
  0xE0E046B9,
  0xE0E08679,
  0xE0E016E9,
  0xE0E01AE5,
  0xE0E0B44B,
  0xE0E0FC03,
  0xE0E07C83,
  0xE0E0A45B,
  0xE0E0629D,
  0xE0E0E21D,
  0xE0E052AD,
  0xE0E0A25D,
  0xE0E012ED,
  0xE0E036C9,
  0xE0E028D7,
  0xE0E0A857,
  0xE0E06897
};


void setup()
{
  gw.begin(incomingMessage, NODE_ID, true);
  gw.sendSketchInfo("IR Remote", "1.0");

  gw.present(CHILD_ID_TV, S_IR);
  gw.present(CHILD_ID_BBOX, S_IR);
  gw.present(CHILD_ID_HDMI, S_IR);
}

void loop() {
  gw.process();
}

void incomingMessage(const MyMessage &message) {
  if (message.sensor == CHILD_ID_TV) {
    Serial.println("TV press");
    for (int i = 0; i < 3; i++) {
      irsend.sendSAMSUNG(tvArr[message.getInt()], 32);
      delay(40);
    }
  }

  if (message.sensor == CHILD_ID_BBOX) {
    Serial.println("BBox press");
    for (int i = 0; i < 3; i++) {
      irsend.sendNEC(tvArr[message.getInt()], 32);
      delay(40);
    }
  }

  if (message.sensor == CHILD_ID_HDMI) {
    Serial.println("HDMI press");
    for (int i = 0; i < 3; i++) {
      irsend.sendNEC(hdmiArr[message.getInt()], 32);
      delay(40);
    }
  }
}
