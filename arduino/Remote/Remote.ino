#include <LiquidCrystal.h>
#include <LiquidMenu.h>
#include <Bounce2.h>
#include <Encoder.h>

const byte LCD_RS = 12;
const byte LCD_E = 11;
const byte LCD_D4 = 5;
const byte LCD_D5 = 4;
const byte LCD_D6 = 3;
const byte LCD_D7 = 2;
const byte ENCODER_PIN_1 = 6;
const byte ENCODER_PIN_2 = 7;
const byte ENCODER_PIN_SW = 8;

uint8_t rotaryValue = 0;
long oldPositionRotary = -999;
Encoder rotaryButton(ENCODER_PIN_1, ENCODER_PIN_2);

Bounce debouncerRotaryButton = Bounce();

// init lisqui menu with lcd
LiquidCrystal lcd(LCD_RS, LCD_E, LCD_D4, LCD_D5, LCD_D6, LCD_D7);
LiquidMenu menu(lcd);

// home screen
LiquidLine home_line1(1, 0, "1.Télécommande");
LiquidLine home_line2(1, 1, "2.Chauffage");
LiquidLine home_line3(1, 2, "3.Autre");
LiquidLine home_line4(1, 3, " I/O TV  | I/O son ");
LiquidScreen homeScreen(home_line1, home_line2, home_line3, home_line4);

// volume screen
LiquidLine volume_line1(1, 0, "Volume TV");
LiquidLine volume_line2(1, 1, ">>>>>>>>>>");
LiquidLine volume_line3(1, 2, "");
LiquidLine volume_line4(1, 3, "");
LiquidScreen volumeScreen(volume_line1, volume_line2, volume_line3, volume_line4);

const byte HOME = 0;
const byte VOLUME = 1;
byte currentMenu = 0;

void setup()
{
  Serial.begin(250000);
  lcd.begin(20, 4);

  pinMode(ENCODER_PIN_SW, INPUT_PULLUP);
  debouncerRotaryButton.attach(ENCODER_PIN_SW);
  debouncerRotaryButton.interval(5);
  
  menu.add_screen(homeScreen);
  menu.add_screen(volumeScreen);
}


void loop()
{
  debouncerRotaryButton.update();
  int rotaryButtonValue = debouncerRotaryButton.read();
  long positionRotary = rotaryButton.read();
  if (oldPositionRotary != positionRotary) {

    if (currentMenu == HOME) {
      rotaryValue = rotaryValue + positionRotary;
      rotaryValue = constrain(rotaryValue, 1, 4);
    }

    if (currentMenu == VOLUME) {
      rotaryValue = positionRotary;
    }
  }
Serial.println(rotaryButtonValue);
  if (currentMenu == HOME) {
    menu.change_screen(volumeScreen);
    menu.update();
    currentMenu = VOLUME;
  }

}

