#define MY_RADIO_NRF24
#define MY_NODE_ID 7
#define MY_RF24_PA_LEVEL RF24_PA_HIGH

#include <SPI.h>
#include <MySensors.h>
#include <DHT.h>

#define CHILD_ID_TEMP 3
#define CHILD_ID_HUM 2
#define HUMIDITY_SENSOR_DIGITAL_PIN 3
unsigned long SLEEP_TIME = 60000; // Sleep time between reads (in milliseconds)

MyMessage msgTemp(CHILD_ID_TEMP, V_TEMP);
MyMessage msgHum(CHILD_ID_HUM, V_HUM);
DHT dht(HUMIDITY_SENSOR_DIGITAL_PIN, DHT22);

void setup()
{
  dht.begin();
}

void presentation()
{
  sendSketchInfo("DHT Chambre", "2.0");
  present(CHILD_ID_TEMP, S_TEMP);
  present(CHILD_ID_HUM, S_HUM);
}

void loop()
{
  delay(4000);

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (!isnan(humidity)) {
    send(msgHum.set(humidity, 1));
  }

  if (!isnan(temperature)) {
    send(msgTemp.set(temperature, 1));
  }

  sleep(SLEEP_TIME); //sleep a bit
}

