void notify()
{
  digitalWrite(LED_NOTIFICATION, HIGH);
  delay(10);
  digitalWrite(LED_NOTIFICATION, LOW);
  delay(5);
}

bool isMenu(byte menu)
{
  return currentMenu == menu;
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

bool isButtonEncoderPressed()
{
  return lastRotaryButtonValue == HIGH and rotaryButtonValue == LOW;
}

void updateMenuInterrupteur(int* step)
{
  if (false == isMenu(INTERRUPTEUR)) {
    return;
  }

  interrupteur_line4_message = "Retour |   | On/Off";
  if (step == 3) {
    interrupteur_line4_message = "Retour | G | BBOX";
  }
}

void toggleMessageMute()
{
  if (messageMute == "Non") {
    messageMute = "Oui";

    return;
  }

  messageMute = "Non";
}
