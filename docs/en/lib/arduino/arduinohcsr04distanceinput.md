# ArduinoHCSR04DistanceInput

Function to receive data from the distance sensor. Must be called after [ArduinoReceiveData](/lib/arduino/arduinoreceivedata).

```
// Digital pin 0 will be output and Digital pin 1 will be input. Connect the echo pin of the sensor to pin 1.
ArduinoGCSR04Trigger(0);
// Receive data from digital pin 1
int: distance = ArduinoHCSR04DistanceInput(1);
```

## Argument

#### Pin Number

The pin number of the input pin.

## Return Value

#### Distance

The distance from the sensor to the object in front of the sensor returned in centimeters.