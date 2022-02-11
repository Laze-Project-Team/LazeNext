# ArduinoHCSR04Trigger

Function to set a pin as a trigger pin of a [HCSR04 distance sensor](https://www.sparkfun.com/products/15569).
We have only tested this function with the HCSR04 sensor, but it should work with any ultrasonic distance sensors.
By executing this function, the selected pin will be an output pin, and the pin next to the selected pin will be set as input to receive the data from the distance sensor. Connect the echo pin of the sensor to the input pin.

```
// Digital pin 0 will be output and Digital pin 1 will be input. Connect the echo pin of the sensor to pin 1.
ArduinoGCSR04Trigger(0);
```

## Argument

#### Pin Number

The number of the digital pin to output 5V.

## Return Value

None