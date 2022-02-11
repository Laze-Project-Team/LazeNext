# Arduino Library

This library allows you to program the Arduino.

## Classes

List of classes in this library:

### [ArduinoClass](/lib/arduino/arduinoclass)

This class stores const variables. 

## Functions

### [ArduinoSetup](/lib/arduino/arduinosetup)

Connect an Arduino with this function.

### [ArduinoReceiveData](/lib/arduino/arduinoreceivedata)

Receive data from the connected Arduino. This function is needed to call [ArduinoAnalogInput](/lib/arduino/arduinoAnalogInput) and [ArduinoDigitalInput](/lib/arduino/arduinoDigitalInput).

### [ArduinoAnalogInput](/lib/arduino/arduinoanaloginput)

Receive analog data from the connected Arduino.

### [ArduinoDigitalInput](/lib/arduino/arduinodigitalinput)

Receive digital data from the connected Arduino.

### [ArduinoHCSR04DistanceInput](/lib/arduino/arduinohcsr04distanceinput)

Receive the distance data from a HCSR04 distance sensor connected to the Arduino.

### [ArduinoOutput5V](/lib/arduino/arduinooutput5v)

Output 5V to the selected pin.

### [ArduinoOutput0V](/lib/arduino/arduinooutput0v)

Output 0V to the selected pin.

### [ArduinoSetPinmode](/lib/arduino/arduinosetpinmode)

Sets whether a pin on the connected Arduino is input or output. 

### [ArduinoSetAnalogInputPin](/lib/arduino/arduinosetanaloginputpin)

Sets a analog pin on the connected Arduino as input.

### [ArduinoHCSR04Trigger](/lib/arduino/arduinohcsr04trigger)

Sets a pin as a trigger pin of a HCSR04 distance sensor.