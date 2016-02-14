#include <SPI.h>
#include <MySensor.h>
#include <DHT.h>

#define CHILD_ID_TEMP 3
#define CHILD_ID_HUM 2
#define HUMIDITY_SENSOR_DIGITAL_PIN 3
unsigned long SLEEP_TIME = 60000; // Sleep time between reads (in milliseconds)

MySensor gw;
MyMessage msgTemp(CHILD_ID_TEMP, V_TEMP);
MyMessage msgHum(CHILD_ID_HUM, V_HUM);
DHT dht;

void setup()
{
  gw.begin(NULL, 0);

  dht.setup(HUMIDITY_SENSOR_DIGITAL_PIN);
  // Send the Sketch Version Information to the Gateway
  gw.sendSketchInfo("DHT22", "1.0");

  // Register all sensors to gw (they will be created as child devices)
  gw.present(CHILD_ID_TEMP, S_TEMP);
  gw.present(CHILD_ID_HUM, S_HUM);
}

void loop()
{
  delay(4000);

  float temperature = dht.getTemperature();
  float humidity = dht.getHumidity();

  gw.send(msgHum.set(humidity, 1));
  gw.send(msgTemp.set(temperature, 1));

  gw.sleep(SLEEP_TIME); //sleep a bit
}


