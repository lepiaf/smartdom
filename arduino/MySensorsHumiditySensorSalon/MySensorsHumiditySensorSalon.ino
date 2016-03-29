#include <MyTransportNRF24.h>
#include <MyHwATMega328.h>
#include <MySensor.h>
#include <SPI.h>
#include <DHT.h>

#define CHILD_ID_TEMP 5
#define CHILD_ID_HUM 4
#define NODE_ID 4
#define HUMIDITY_SENSOR_DIGITAL_PIN 3

unsigned long SLEEP_TIME = 60000; // Sleep time between reads (in milliseconds)

MyTransportNRF24 radio(RF24_CE_PIN, RF24_CS_PIN, RF24_PA_LEVEL_GW);  
MyHwATMega328 hw;
MySensor gw(radio, hw);

MyMessage msgTemp(CHILD_ID_TEMP, V_TEMP);
MyMessage msgHum(CHILD_ID_HUM, V_HUM);
DHT dht;

void setup()
{
  gw.begin(NULL, NODE_ID);

  dht.setup(HUMIDITY_SENSOR_DIGITAL_PIN);
  // Send the Sketch Version Information to the Gateway
  gw.sendSketchInfo("Salon", "1.0");

  // Register all sensors to gw (they will be created as child devices)
  gw.present(CHILD_ID_TEMP, S_TEMP);
  gw.present(CHILD_ID_HUM, S_HUM);
}

void loop()
{
  delay(4000);

  float temperature = dht.getTemperature();
  float humidity = dht.getHumidity();

  gw.send(msgHum.set(humidity, 0));
  gw.send(msgTemp.set(temperature, 0));

  gw.sleep(SLEEP_TIME); //sleep a bit
}


