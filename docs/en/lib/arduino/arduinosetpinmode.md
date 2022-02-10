# ArduinoSetPinmode

Function to set the mode of the selected digital pin. To set the mode of a analog pin, see [ArduinoSetAnalogInputPin](/lib/arduino/arduinosetanaloginputpin).

```
// Declare an ArduinoClass object.
ArduinoClass:Arduino();
// Set pin 2 as input.
ArduinoSetPinmode(2, Arduino.INPUT);
```

## Argument

#### Pin Number

The number of the pin to set.

#### Mode

The mode to set the pin to. It is a char type. 

If you want to set the pin to input, use the INPUT member of the [ArduinoClass](/lib/arduino/arduinoclass), and to set the pin to output, use the OUTPUT member of the [ArduinoClass](/lib/arduino/arduinoclass).

## Return Value

None