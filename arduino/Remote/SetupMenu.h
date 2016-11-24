#include <LiquidCrystal.h>
#include <LiquidMenu.h>

const byte LCD_RS = 12;
const byte LCD_E = 11;
const byte LCD_D4 = 5;
const byte LCD_D5 = 4;
const byte LCD_D6 = 3;
const byte LCD_D7 = 2;

char cursorMenuLine1 = '>';
char cursorMenuLine2 = ' ';
char cursorMenuLine3 = ' ';
char cursorMenuLine4 = ' ';

char directionVolume = ' ';
char directionChaine = ' ';

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
