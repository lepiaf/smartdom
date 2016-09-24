#define MY_DEBUG
#define MY_RADIO_NRF24
#define MY_NODE_ID 10
#define MY_RF24_CS_PIN 7
#define MY_RF24_CE_PIN 8
#define MY_RF24_PA_LEVEL RF24_PA_LOW
#define CHILD_ID_REMOTE 1

#include <SPI.h>
#include <MySensors.h>
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
const byte ENCODER_PIN_1 = 9;
const byte ENCODER_PIN_2 = 10;
const byte ENCODER_PIN_SW = 6;
const byte HOME = 0;
const byte VOLUME = 1;

byte currentMenu = 0;
int rotaryValue = 0;
long oldPositionRotary = -999;
char cursorMenuLine1 = '>';
char cursorMenuLine2 = ' ';
char cursorMenuLine3 = ' ';
char cursorMenuLine4 = ' ';
int step = 0;
char direction;
int selectedMenuLine = 1;
char directionVolume = ' ';

MyMessage msg(CHILD_ID_REMOTE, V_IR_SEND);

void presentation()  {
  // Send the sketch version information to the gateway and Controller
  sendSketchInfo("Remote", "1.0");

  // Register all sensors to gateway (they will be created as child devices)
  present(CHILD_ID_REMOTE, S_IR);
}

Encoder rotaryButton(ENCODER_PIN_1, ENCODER_PIN_2);
Bounce debouncerRotaryButton = Bounce();

LiquidCrystal lcd(LCD_RS, LCD_E, LCD_D4, LCD_D5, LCD_D6, LCD_D7);
LiquidMenu menu(lcd);

// home screen
LiquidLine home_line1(0, 0, cursorMenuLine1, "1.Telecommande");
LiquidLine home_line2(0, 1, cursorMenuLine2, "2.Chauffage");
LiquidLine home_line3(0, 2, cursorMenuLine3, "3.Autre");
LiquidLine home_line4(0, 3, cursorMenuLine4, " I/O TV  | I/O son ");
LiquidScreen homeScreen(home_line1, home_line2, home_line3, home_line4);

// volume screen
LiquidLine volume_line1(1, 0, "Volume TV");
LiquidLine volume_line2(1, 1, "Direction: ", directionVolume);
LiquidLine volume_line3(1, 2, "");
LiquidLine volume_line4(1, 3, "");
LiquidScreen volumeScreen(volume_line1, volume_line2, volume_line3, volume_line4);

void setup()
{
  Serial.begin(115200);
  lcd.begin(20, 4);

  pinMode(ENCODER_PIN_SW, INPUT_PULLUP);
  debouncerRotaryButton.attach(ENCODER_PIN_SW);
  debouncerRotaryButton.interval(5);

  menu.add_screen(homeScreen);
  menu.add_screen(volumeScreen);
  menu.update();
}



int lastRotaryButtonValue = HIGH;
void loop()
{
  debouncerRotaryButton.update();
  int rotaryButtonValue = debouncerRotaryButton.read();
  long positionRotary = rotaryButton.read();

  if (oldPositionRotary != positionRotary) {
    if (positionRotary == 0) {
      step = 0;
    }

    if (oldPositionRotary < positionRotary and (positionRotary % 4) == 0) {
      oldPositionRotary = positionRotary;
      step++;
      direction = '+';
    }

    if (oldPositionRotary > positionRotary and (positionRotary % 4) == 0) {
      oldPositionRotary = positionRotary;
      step--;
      direction = '-';
    }

    if (currentMenu == HOME) {
      if (step < 1) {
        step = 1;
      }

      if (step > 4) {
        step = 4;
      }
      switch (step) {
        case 1:
          cursorMenuLine1 = '>';
          cursorMenuLine2 = ' ';
          cursorMenuLine3 = ' ';
          cursorMenuLine4 = ' ';
          break;
        case 2:
          cursorMenuLine1 = ' ';
          cursorMenuLine2 = '>';
          cursorMenuLine3 = ' ';
          cursorMenuLine4 = ' ';
          break;
        case 3:
          cursorMenuLine1 = ' ';
          cursorMenuLine2 = ' ';
          cursorMenuLine3 = '>';
          cursorMenuLine4 = ' ';
          break;
        case 4:
          cursorMenuLine1 = ' ';
          cursorMenuLine2 = ' ';
          cursorMenuLine3 = ' ';
          cursorMenuLine4 = '>';
          break;
        default:
          break;
      }

      if (step != selectedMenuLine) {
        menu.update();
      }
      selectedMenuLine = step;
    }


    if (currentMenu == VOLUME) {
      if (step == 2) {
        step = 1;
        Serial.println("raise volume");
        directionVolume = '+';
        menu.update();
        msg.setSensor(1);
        msg.setDestination(3);
        send(msg.set(15), true);
        wait(500);
      }

      if (step == 0) {
        step = 1;
        Serial.println("lower volume");
        directionVolume = '-';
        menu.update();
        msg.setSensor(1);
        msg.setDestination(3);
        send(msg.set(16), true);
        wait(500);
      }
    }
  }

  if (currentMenu == HOME and rotaryButtonValue == LOW) {
    menu.change_screen(volumeScreen);
    menu.update();
    currentMenu = VOLUME;
    delay(200);

    return;
  }
}


