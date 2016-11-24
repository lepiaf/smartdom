#include <Encoder.h>

const byte ENCODER_PIN_1 = 9;
const byte ENCODER_PIN_2 = 10;
const byte ENCODER_PIN_SW = 6;

int rotaryValue = 0;
long oldPositionRotary = -999;
long positionRotary = -999;
int step = 0;
char direction;
int selectedMenuLine = 1;

int lastRotaryButtonValue = HIGH;
int rotaryButtonValue = HIGH;

Encoder rotaryButton(ENCODER_PIN_1, ENCODER_PIN_2);
Bounce debouncerRotaryButton = Bounce();
