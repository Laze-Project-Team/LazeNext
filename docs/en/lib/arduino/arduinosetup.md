# ArduinoSetup

Function to connect the Arduino with the Laze program.

```
// Declare an ArduinoClass object.
ArduinoClass:Arduino();
// Arduino Uno Vendor ID is 2A03
ArduinoSetup(0x2A03, () => (){
    // Set Pin 12 as output
	ArduinoSetPinmode(12, Arduino.OUTPUT);
    // Set Pin 2 as input
	ArduinoSetPinmode(2, Arduino.INPUT);
});
```

## Argument

#### Vendor ID

This ID is used to connect the browser and the Arduino.
If you are using Arduino UNO, your vendor ID is 0x2A03, and if you are using Arduino Leonardo, your vendor ID is 0x2341.

#### Callback

A function to call when Laze is done setting up the Arduino.

## Return Value

None