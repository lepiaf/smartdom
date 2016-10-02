#define MY_DEBUG
#define MY_RADIO_NRF24
#define MY_RF24_PA_LEVEL RF24_PA_HIGH
#define MY_NODE_ID 2

#include <SPI.h>
#include <MySensors.h>

#define PIN_RELAY  3  // Arduino Digital I/O pin number for first relay (second on pin+1 etc)
#define NUMBER_OF_RELAYS 8 // Total number of attached relays
#define RELAY_ON 1  // GPIO value to write to turn on attached relay
#define RELAY_OFF 0 // GPIO value to write to turn off attached relay

void before()
{
  for (int sensor = 1, pin = PIN_RELAY; sensor <= NUMBER_OF_RELAYS; sensor++, pin++) {
    // Then set relay pins in output mode
    pinMode(pin, OUTPUT);
    // Set relay to last known state (using eeprom storage)
    digitalWrite(pin, loadState(sensor) ? RELAY_ON : RELAY_OFF);
  }
}

void setup()
{

}

void presentation()
{
  // Send the sketch version information to the gateway and Controller
  sendSketchInfo("Heater", "2.0");

  for (int sensor = 1, pin = PIN_RELAY; sensor <= NUMBER_OF_RELAYS; sensor++, pin++) {
    // Register all sensors to gw (they will be created as child devices)
    present(sensor, S_LIGHT);
  }
}

void loop()
{
}

void receive(const MyMessage &message) 
{
  if (message.type == V_LIGHT) {
    digitalWrite(message.sensor - 1 + PIN_RELAY, message.getBool() ? RELAY_ON : RELAY_OFF);
  }
}

