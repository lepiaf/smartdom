void sendCommand(int node, int sensor, int payload)
{
  msg.setSensor(sensor);
  msg.setDestination(node);
  gw.send(msg.set(payload));
  gw.wait(100);
  notify();

  return;
}
