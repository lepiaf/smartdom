#define MY_RADIO_NRF24
#define MY_NODE_ID 1
#define MY_RF24_PA_LEVEL RF24_PA_LOW
#define MY_REPEATER_FEATURE

#include <SoftwareSerial.h>
#include <SPI.h>
#include <MySensors.h>
#include "TeleInfo.h"

#define ID_PAPP 4
#define ID_IINST 5
#define ID_HCHC 6
#define ID_HCHP 7
#define ID_OPTARIF 8

TeleInfo* homeTeleInfo;

MyMessage msgPAPP(ID_PAPP, V_WATT);
MyMessage msgIINST(ID_IINST, V_CURRENT);
MyMessage msgHCHC(ID_HCHC, V_KWH);
MyMessage msgHCHP(ID_HCHP, V_KWH);

void setup()
{
  homeTeleInfo = new TeleInfo();
}

void presentation()
{
  sendSketchInfo("teleinfo", "2.0");

  present(ID_PAPP, V_WATT);
  present(ID_IINST, V_CURRENT);
  present(ID_HCHC, V_KWH);
  present(ID_HCHP, V_KWH);
}


void loop()
{
  boolean readCompleted;
  readCompleted = homeTeleInfo->readTeleInfo();

  if (readCompleted) {
    send(msgIINST.set(homeTeleInfo->IINST, 0));
    delay(100);
    send(msgHCHC.set(homeTeleInfo->HCHC, 0));
    delay(100);
    send(msgHCHP.set(homeTeleInfo->HCHP, 0));
    delay(100);
    send(msgPAPP.set(homeTeleInfo->PAPP, 0));
    delay(100);
  }

  delay(10000);
}
