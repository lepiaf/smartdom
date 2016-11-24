#include <Keypad.h>

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
