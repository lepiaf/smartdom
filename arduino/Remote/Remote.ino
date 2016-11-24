#include <SPI.h>
#include <MyTransportNRF24.h>
#include <MyHwATMega328.h>
#include <MySensor.h>
#include <LiquidCrystal.h>
#include <LiquidMenu.h>
#include <Bounce2.h>
#include <Encoder.h>
#include <Keypad.h>

#define NODE_ID 10
#define MY_RF24_CS_PIN 7
#define MY_RF24_CE_PIN 8
#define MY_RF24_PA_LEVEL RF24_PA_HIGH
#define CHILD_ID_REMOTE 1
#define LED_NOTIFICATION 13

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
const byte CHAUFFAGE = 2;
const byte INTERRUPTEUR = 3;
const byte CHAUFFAGEMODE = 4;
const byte CHANNEL = 5;

byte currentMenu = 0;
int rotaryValue = 0;
long oldPositionRotary = -999;
long positionRotary = -999;
char cursorMenuLine1 = '>';
char cursorMenuLine2 = ' ';
char cursorMenuLine3 = ' ';
char cursorMenuLine4 = ' ';
int step = 0;
char direction;
int selectedMenuLine = 1;
char directionVolume = ' ';
char directionChaine = ' ';

int lastRotaryButtonValue = HIGH;
int rotaryButtonValue = HIGH;

int selectedHeaterId = 1;
int selectedHeaterMode = 1;
int sw1 = 0;
int sw2 = 0;

MyTransportNRF24 transport(MY_RF24_CE_PIN, MY_RF24_CS_PIN, MY_RF24_PA_LEVEL);
MyHwATMega328 hw;
MySensor gw(transport, hw);
MyMessage msg(CHILD_ID_REMOTE, V_IR_SEND);
MyMessage msgSwitch(CHILD_ID_REMOTE, V_STATUS);

Encoder rotaryButton(ENCODER_PIN_1, ENCODER_PIN_2);
Bounce debouncerRotaryButton = Bounce();

LiquidCrystal lcd(LCD_RS, LCD_E, LCD_D4, LCD_D5, LCD_D6, LCD_D7);
LiquidMenu menu(lcd);

// home screen
LiquidLine home_line1(0, 0, cursorMenuLine1, "1.Telecommande");
LiquidLine home_line2(0, 1, cursorMenuLine2, "2.Chauffage");
LiquidLine home_line3(0, 2, cursorMenuLine3, "3.Interrupteur");
LiquidLine home_line4(0, 3, cursorMenuLine4, "Salon | ON | OFF");
LiquidScreen homeScreen(home_line1, home_line2, home_line3, home_line4);

// interrupteur
char* interrupteur_line4_message = "Retour |   | On/Off";
LiquidLine interrupteur_line1(0, 0, cursorMenuLine1, "1.TV");
LiquidLine interrupteur_line2(0, 1, cursorMenuLine2, "2.BBOX");
LiquidLine interrupteur_line3(0, 2, cursorMenuLine3, "3.Port HDMI");
LiquidLine interrupteur_line4(0, 3, cursorMenuLine4, interrupteur_line4_message);
LiquidScreen interrupteurScreen(interrupteur_line1, interrupteur_line2, interrupteur_line3, interrupteur_line4);

// volume screen
char* messageMute = "Non";
LiquidLine volume_line1(0, 0, ">Volume TV: ", directionVolume);
LiquidLine volume_line2(0, 1, " Mute: ", messageMute);
LiquidLine volume_line3(0, 2, " ");
LiquidLine volume_line4(0, 3, " Retour| | Chaine TV");
LiquidScreen volumeScreen(volume_line1, volume_line2, volume_line3, volume_line4);

// change channel tv
LiquidLine channel_line1(0, 0, ">Chaine TV: ", directionChaine);
LiquidLine channel_line2(0, 1, " Mute: ", messageMute);
LiquidLine channel_line3(0, 2, " ");
LiquidLine channel_line4(0, 3, " Retour | |  Vol TV");
LiquidScreen channelScreen(channel_line1, channel_line2, channel_line3, channel_line4);

// chauffage screen
LiquidLine chauffage_line1(0, 0, cursorMenuLine1, "1.Salon Gauche");
LiquidLine chauffage_line2(0, 1, cursorMenuLine2, "2.Salon Droit");
LiquidLine chauffage_line3(0, 2, cursorMenuLine3, "3.Chambre");
LiquidLine chauffage_line4(0, 3, cursorMenuLine4, "Retour");
LiquidScreen chauffageScreen(chauffage_line1, chauffage_line2, chauffage_line3, chauffage_line4);

// chauffage mode screen
LiquidLine chauffage_mode_line1(0, 0, cursorMenuLine1, "1.Stop");
LiquidLine chauffage_mode_line2(0, 1, cursorMenuLine2, "2.Eco");
LiquidLine chauffage_mode_line3(0, 2, cursorMenuLine3, "3.Comfort");
LiquidLine chauffage_mode_line4(0, 3, cursorMenuLine4, "Retour");
LiquidScreen chauffageModeScreen(chauffage_mode_line1, chauffage_mode_line2, chauffage_mode_line3, chauffage_mode_line4);

const byte ROWS = 3; //four rows
const byte COLS = 3; //four columns
//define the cymbols on the buttons of the keypads
char hexaKeys[ROWS][COLS] = {
  {'0', '1', '2'},
  {'3', '4', '5'},
  {'6', '7', '8'}
};
byte rowPins[ROWS] = {22, 23, 24}; //connect to the row pinouts of the keypad
byte colPins[COLS] = {25, 26, 27}; //connect to the column pinouts of the keypad
char customKey = ' ';

//initialize an instance of class NewKeypad
Keypad customKeypad = Keypad( makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);

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

  // switch on/off tv
  if (customKey and isMenu(HOME)) {
    if (customKey == '3' || customKey == '0') {
      msgSwitch.setSensor(1);
      msgSwitch.setType(2);
      msgSwitch.setDestination(2);
      gw.send(msgSwitch.set(customKey == '3' ? 1 : 0));
      gw.wait(10);
      return;
    }
  }

  if (isMenu(HOME) and isButtonEncoderPressed() and selectedMenuLine == 1) {
    resetCursorMenu();

    lastRotaryButtonValue = LOW;
    menu.change_screen(volumeScreen);
    menu.update();
    currentMenu = VOLUME;
    delay(200);

    return;
  }

  if (isMenu(HOME) and isButtonEncoderPressed() and selectedMenuLine == 2) {
    resetCursorMenu();

    lastRotaryButtonValue = LOW;
    menu.change_screen(chauffageScreen);
    menu.update();
    currentMenu = CHAUFFAGE;
    delay(200);

    return;
  }

  if (isMenu(HOME) and isButtonEncoderPressed() and selectedMenuLine == 3) {
    resetCursorMenu();

    lastRotaryButtonValue = LOW;
    menu.change_screen(interrupteurScreen);
    menu.update();
    currentMenu = INTERRUPTEUR;
    delay(200);

    return;
  }

  if (isMenu(CHAUFFAGE) and isButtonEncoderPressed()) {
    resetCursorMenu();

    lastRotaryButtonValue = LOW;
    menu.change_screen(chauffageModeScreen);
    menu.update();
    currentMenu = CHAUFFAGEMODE;
    delay(200);

    return;
  }

  if (isMenu(CHAUFFAGEMODE) and isButtonEncoderPressed()) {
    resetCursorMenu();
    lastRotaryButtonValue = LOW;
    selectHeaterById(selectedHeaterId);

    // do nothing if heater is not selected
    if (sw1 == 0 or sw2 == 0) {
      return;
    }

    // stop
    if (selectedHeaterMode == 1) {
      changeHeaterSwitch(sw1, sw2, 0, 0);
      return;
    }

    // eco
    if (selectedHeaterMode == 2) {
      changeHeaterSwitch(sw1, sw2, 0, 1);
      return;
    }

    // confort
    if (selectedHeaterMode == 3) {
      changeHeaterSwitch(sw1, sw2, 1, 0);
    }

    return;
  }

  if (customKey) {
    if (isMenu(INTERRUPTEUR)) {
      if (customKey == '0') {
        // send on/off
        if (selectedMenuLine == 1) {
          sendCommand(3, 1, 0);
          notify();

          return;
        }

        if (selectedMenuLine == 2) {
          sendCommand(3, 3, 1);
          notify();

          return;
        }
      }

      // select chromecast
      if (selectedMenuLine == 3 and customKey == '3') {
        sendCommand(3, 5, 4);
        notify();

        return;
      }

      // select bbox
      if (selectedMenuLine == 3 and customKey == '0') {
        sendCommand(3, 5, 1);
        notify();

        return;
      }
    }


    if (customKey == '6') {
      resetCursorMenu();
      notify();

      if (isMenu(CHAUFFAGEMODE)) {
        menu.change_screen(chauffageScreen);
        menu.update();
        currentMenu = CHAUFFAGE;

        return;
      }

      menu.change_screen(homeScreen);
      menu.update();
      currentMenu = HOME;

      return;
    }
  }

  if (isMenu(VOLUME) and isButtonEncoderPressed()) {
    lastRotaryButtonValue = LOW;
    Serial.println("mute/unmute volume");
    toggleMessageMute();

    menu.update();
    sendCommand(3, 1, 2);
    return;
  }

  // moving rotary button
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

    if (
      isMenu(HOME) or
      isMenu(CHAUFFAGE) or
      isMenu(CHAUFFAGEMODE) or
      isMenu(INTERRUPTEUR)
    ) {
      if (step < 1) {
        step = 1;
      }

      if (step > 3) {
        step = 3;
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
        default:
          break;
      }

      if (step != selectedMenuLine) {
        updateMenuInterrupteur(step);
        notify();
        menu.update();
      }
      selectedMenuLine = step;
    }

    if (isMenu(CHAUFFAGEMODE)) {
      selectedHeaterMode = selectedMenuLine;
    }

    if (isMenu(CHAUFFAGE)) {
      selectedHeaterId = selectedMenuLine;
    }

    if (isMenu(VOLUME)) {
      if (step == 2) {
        step = 1;
        directionVolume = '+';
        menu.update();
        msg.setSensor(1);
        msg.setDestination(3);
        gw.send(msg.set(15));
        gw.wait(10);
      }

      if (step == 0) {
        step = 1;
        directionVolume = '-';
        menu.update();
        msg.setSensor(1);
        msg.setDestination(3);
        gw.send(msg.set(16));
        gw.wait(10);
      }
    }
  }
}

void resetCursorMenu()
{
  selectedMenuLine = 1;
  step = 1;
  cursorMenuLine1 = '>';
  cursorMenuLine2 = ' ';
  cursorMenuLine3 = ' ';
  cursorMenuLine4 = ' ';
}

void changeHeaterSwitch(int sw1, int sw2, int sw1Value, int sw2Value)
{
  msgSwitch.setSensor(sw1);
  msgSwitch.setDestination(5);
  gw.send(msgSwitch.set(sw1Value));
  gw.wait(100);
  msgSwitch.setSensor(sw2);
  msgSwitch.setDestination(5);
  gw.send(msgSwitch.set(sw2Value));
  gw.wait(100);
  notify();
}

void selectHeaterById(int id)
{
  if (id == 1) {
    sw1 = 3;
    sw2 = 4;
  }

  // salon droit
  if (id == 2) {
    sw1 = 5;
    sw2 = 6;
  }

  // chambre
  if (id == 3) {
    sw1 = 1;
    sw2 = 2;
  }

  notify();
}

bool isButtonEncoderPressed()
{
  if (lastRotaryButtonValue == HIGH and rotaryButtonValue == LOW) {
    notify();
    return true;
  }

  return false;
}

bool isMenu(byte menu)
{
  return currentMenu == menu;
}

void sendCommand(int node, int sensor, int payload) {
  msg.setSensor(sensor);
  msg.setDestination(node);
  gw.send(msg.set(payload));
  gw.wait(100);
  notify();

  return;
}

void notify() {
  digitalWrite(LED_NOTIFICATION, HIGH);
  delay(250);
  digitalWrite(LED_NOTIFICATION, LOW);
}

void updateMenuInterrupteur(int* step) {
  if (isMenu(INTERRUPTEUR)) {
    interrupteur_line4_message = "Retour |   | On/Off";
    if (step == 3) {
      interrupteur_line4_message = "Retour | G | BBOX";
    }

    return;
  }
}

void toggleMessageMute() {
  if (messageMute == "Non") {
    messageMute = "Oui";

    return;
  }

  messageMute = "Non";
}
