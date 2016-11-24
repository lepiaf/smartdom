#include <Bounce2.h>
#include "Setup/MySensor.h"
#include "Setup/Menu.h"
#include "Setup/Keypad.h"
#include "Setup/Encoder.h"
#include "Variables.h"
#include "Helpers.h"
#include "Manager/MySensor.h"
#include "Manager/HeaterManager.h"
#include "Manager/Keypad.h"
#include "Manager/RotaryEncoder.h"

void setup()
{
  Serial.begin(115200);

  gw.begin();
  gw.sendSketchInfo("Remote", "1.0");

  lcd.begin(20, 4);

  pinMode(LED_NOTIFICATION, OUTPUT);
  pinMode(ENCODER_PIN_SW, INPUT_PULLUP);
  debouncerRotaryButton.attach(ENCODER_PIN_SW);
  debouncerRotaryButton.interval(5);

  menu.add_screen(homeScreen);
  menu.add_screen(volumeScreen);
  menu.add_screen(chauffageScreen);
  menu.add_screen(chauffageModeScreen);
  menu.add_screen(channelScreen);
  menu.add_screen(interrupteurScreen);

  menu.update();
}

void loop()
{
  customKey = customKeypad.getKey();
  debouncerRotaryButton.update();
  rotaryButtonValue = debouncerRotaryButton.read();
  positionRotary = rotaryButton.read();

  if (rotaryButtonValue == HIGH) {
    lastRotaryButtonValue = HIGH;
  }

  if (customKey) {
    onKeypadPress();
  }

  if (isButtonEncoderPressed()) {
    onButtonEncoderPressed();
  }

  onRotaryEncoderChange();
}
