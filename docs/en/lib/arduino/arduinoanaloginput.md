# ArduinoAnalogInput

Function to receive data from an analog input pin. Must be called after [ArduinoReceiveData](/lib/arduino/arduinoreceivedata).

```
ArduinoClass:Arduino();
// Analog pin 0 will be input.
ArduinoSetnalogInputPin(0);
// Receive data from digital pin 0
int: data = ArduinoHCSR04DistanceInput(0);
```

## Argument

#### Pin Number

The pin number of the input pin.

## Return Value

#### Data

Data from the input pin returned as a integer.