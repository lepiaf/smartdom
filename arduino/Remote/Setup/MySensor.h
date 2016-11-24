#include <SPI.h>
#include <MyTransportNRF24.h>
#include <MyHwATMega328.h>
#include <MySensor.h>

#define NODE_ID 10
#define CHILD_ID_REMOTE 1
#define MY_RF24_CS_PIN 7
#define MY_RF24_CE_PIN 8
#define MY_RF24_PA_LEVEL RF24_PA_HIGH

MyTransportNRF24 transport(MY_RF24_CE_PIN, MY_RF24_CS_PIN, MY_RF24_PA_LEVEL);
MyHwATMega328 hw;
MySensor gw(transport, hw);
MyMessage msg(CHILD_ID_REMOTE, V_IR_SEND);
MyMessage msgSwitch(CHILD_ID_REMOTE, V_STATUS);
