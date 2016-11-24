void onKeypadPress()
{
  notify();

  // switch on/off salon
  if (isMenu(HOME)) {
    if (customKey == '3' || customKey == '0') {
      msgSwitch.setSensor(1);
      msgSwitch.setType(2);
      msgSwitch.setDestination(2);
      gw.send(msgSwitch.set(customKey == '3' ? 1 : 0));
      gw.wait(10);

      return;
    }
  }

  if (isMenu(VOLUME)) {
    if (customKey == '0') {
      resetCursorMenu();
      menu.change_screen(channelScreen);
      menu.update();
      currentMenu = CHANNEL;

      return;
    }
  }

  if (isMenu(CHANNEL)) {
    if (customKey == '0') {
      resetCursorMenu();
      menu.change_screen(volumeScreen);
      menu.update();
      currentMenu = VOLUME;

      return;
    }
  }

  if (isMenu(INTERRUPTEUR)) {
    if (customKey == '0') {
      // send on/off
      if (selectedMenuLine == 1) {
        sendCommand(3, 1, 0);

        return;
      }

      if (selectedMenuLine == 2) {
        sendCommand(3, 3, 1);

        return;
      }
    }

    // select chromecast
    if (selectedMenuLine == 3 and customKey == '3') {
      sendCommand(3, 5, 4);

      return;
    }

    // select bbox
    if (selectedMenuLine == 3 and customKey == '0') {
      sendCommand(3, 5, 1);

      return;
    }
  }

  // back button, always number 6
  if (customKey == '6') {
    resetCursorMenu();

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
