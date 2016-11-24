void onRotaryEncoderChange()
{
  if (oldPositionRotary == positionRotary) {
    return;
  }

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

  notify();

  if (isMenu(VOLUME)) {
    if (step == 2) {
      step = 1;
      directionVolume = '+';
      menu.update();
      delay(100);
      sendCommand(3, 1, 15);
    }

    if (step == 0) {
      step = 1;
      directionVolume = '-';
      menu.update();
      delay(100);
      sendCommand(3, 1, 16);
    }

    return;
  }

  if (isMenu(CHANNEL)) {
    if (step == 2) {
      step = 1;
      directionChaine = '+';
      menu.update();
      delay(100);
      sendCommand(3, 3, 12);
    }

    if (step == 0) {
      step = 1;
      directionChaine = '-';
      menu.update();
      delay(100);
      sendCommand(3, 3, 13);
    }

    return;
  }

  if (
    !isMenu(HOME) and
    !isMenu(CHAUFFAGE) and
    !isMenu(CHAUFFAGEMODE) and
    !isMenu(INTERRUPTEUR)
  ) {
    return;
  }

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
    menu.update();
  }

  selectedMenuLine = step;

  if (isMenu(CHAUFFAGEMODE)) {
    selectedHeaterMode = selectedMenuLine;
  }

  if (isMenu(CHAUFFAGE)) {
    selectedHeaterId = selectedMenuLine;
  }
}

void onButtonEncoderPressed()
{
  notify();

  if (isMenu(HOME)) {
    if (selectedMenuLine == 1) {
      resetCursorMenu();

      lastRotaryButtonValue = LOW;
      menu.change_screen(volumeScreen);
      menu.update();
      currentMenu = VOLUME;
      delay(200);

      return;
    }

    if (selectedMenuLine == 2) {
      resetCursorMenu();

      lastRotaryButtonValue = LOW;
      menu.change_screen(chauffageScreen);
      menu.update();
      currentMenu = CHAUFFAGE;
      delay(200);

      return;
    }

    if (selectedMenuLine == 3) {
      resetCursorMenu();

      lastRotaryButtonValue = LOW;
      menu.change_screen(interrupteurScreen);
      menu.update();
      currentMenu = INTERRUPTEUR;
      delay(200);

      return;
    }
  }

  if (isMenu(VOLUME)) {
    lastRotaryButtonValue = LOW;
    toggleMessageMute();

    menu.update();
    sendCommand(3, 1, 2);

    return;
  }

  if (isMenu(CHAUFFAGEMODE)) {
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

  if (isMenu(CHAUFFAGE)) {
    resetCursorMenu();

    lastRotaryButtonValue = LOW;
    menu.change_screen(chauffageModeScreen);
    menu.update();
    currentMenu = CHAUFFAGEMODE;
    delay(200);

    return;
  }
}
