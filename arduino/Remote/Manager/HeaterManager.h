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
}
