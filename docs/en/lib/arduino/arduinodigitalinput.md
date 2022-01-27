# ArduinoDigitalInput

Function to receive data from a digital input pin. Must be called after [ArduinoReceiveData](/lib/arduino/arduinoreceivedata).

```
ArduinoClass:Arduino();
// Digital pin 0 will be input.
ArduinoSetPinmode(0, Arduino.INPUT);
// Receive data from digital pin 0
int: data = ArduinoDigitalInput(0);
```

## Argument

#### Pin Number

The pin number of the input pin.

## Return Value

#### Data

Data from the input pin as a integer. The data is either 0 or 1, returning 0 when the voltage on the pin is 0V and returning 1 when the voltage is 5V.