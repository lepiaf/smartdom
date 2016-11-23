#include <MyTransportNRF24.h>
#include <MyHwATMega328.h>
#include <MySensor.h>
#include <SPI.h>
#include <DHT.h>

#define CHILD_ID_TEMP 6
#define CHILD_ID_HUM 7
#define NODE_ID 9
#define HUMIDITY_SENSOR_DIGITAL_PIN 2

unsigned long SLEEP_TIME = 60000; // Sleep time between reads (in milliseconds)

MyTransportNRF24 radio(RF24_CE_PIN, RF24_CS_PIN, RF24_PA_HIGH);
MyHwATMega328 hw;
MySensor gw(radio, hw);

MyMessage msgTemp(CHILD_ID_TEMP, V_TEMP);
MyMessage msgHum(CHILD_ID_HUM, V_HUM);
DHT dht(HUMIDITY_SENSOR_DIGITAL_PIN, DHT11);

void setup()
{
  dht.begin();
  gw.begin(NULL, NODE_ID, true);
  gw.sendSketchInfo("SDB", "1.0");

  // Register all sensors to gw (they will be created as child devices)
  gw.present(CHILD_ID_TEMP, S_TEMP);
  gw.present(CHILD_ID_HUM, S_HUM);
}

void loop()
{
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  gw.send(msgHum.set(humidity, 1));
  gw.wait(500);
  gw.send(msgTemp.set(temperature, 1));
  
  gw.wait(SLEEP_TIME); //sleep a bit
}
