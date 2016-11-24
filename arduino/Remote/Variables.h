#define LED_NOTIFICATION 30

const byte HOME = 0;
const byte VOLUME = 1;
const byte CHAUFFAGE = 2;
const byte INTERRUPTEUR = 3;
const byte CHAUFFAGEMODE = 4;
const byte CHANNEL = 5;

byte currentMenu = 0;
int selectedHeaterId = 1;
int selectedHeaterMode = 1;
int sw1 = 0;
int sw2 = 0;
