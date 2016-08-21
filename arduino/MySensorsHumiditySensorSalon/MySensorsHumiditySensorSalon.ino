#define MY_RADIO_NRF24
#define MY_NODE_ID 4
#define MY_RF24_PA_LEVEL RF24_PA_LOW

#include <SPI.h>
#include <MySensors.h>
#include <DHT.h>

#define CHILD_ID_TEMP 5
#define CHILD_ID_HUM 4
#define HUMIDITY_SENSOR_DIGITAL_PIN 3
unsigned long SLEEP_TIME = 60000; // Sleep time between reads (in milliseconds)

MyMessage msgTemp(CHILD_ID_TEMP, V_TEMP);
MyMessage msgHum(CHILD_ID_HUM, V_HUM);
DHT dht;

void setup()
{
  dht.setup(HUMIDITY_SENSOR_DIGITAL_PIN);
}

void presentation()
{
  sendSketchInfo("DHT Salon", "2.0");
  present(CHILD_ID_TEMP, S_TEMP);
  present(CHILD_ID_HUM, S_HUM);
}

void loop()
{
  delay(4000);

  float temperature = dht.getTemperature();
  float humidity = dht.getHumidity();

  send(msgHum.set(humidity, 1));
  send(msgTemp.set(temperature, 1));

  sleep(SLEEP_TIME); //sleep a bit
}


