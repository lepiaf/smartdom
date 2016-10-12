#include <MyTransportNRF24.h>
#include <MyHwATMega328.h>
#include <MySensor.h>
#include <SPI.h>
#include <DHT.h>

#define CHILD_ID_TEMP 3
#define CHILD_ID_HUM 2
#define NODE_ID 7
#define HUMIDITY_SENSOR_DIGITAL_PIN 3

unsigned long SLEEP_TIME = 60000; // Sleep time between reads (in milliseconds)

MyTransportNRF24 radio(RF24_CE_PIN, RF24_CS_PIN, RF24_PA_LOW);
MyHwATMega328 hw;
MySensor gw(radio, hw);

MyMessage msgTemp(CHILD_ID_TEMP, V_TEMP);
MyMessage msgHum(CHILD_ID_HUM, V_HUM);
DHT dht(HUMIDITY_SENSOR_DIGITAL_PIN, DHT22);

void setup()
{
  dht.begin();
  gw.begin(NULL, NODE_ID, false, 0);
  gw.sendSketchInfo("Chambre", "1.0");

  // Register all sensors to gw (they will be created as child devices)
  gw.present(CHILD_ID_TEMP, S_TEMP);
  gw.present(CHILD_ID_HUM, S_HUM);
}

void loop()
{
  delay(4000);

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  gw.send(msgHum.set(humidity, 1));
  gw.send(msgTemp.set(temperature, 1));
  
  gw.sleep(SLEEP_TIME); //sleep a bit
}
