### What is line tracing?

A linetrace robot is a robot that traces over a line on a competition table.

### Specification Description

---

#### Motor ON/OFF

`robot.leftMotorON`: Turns the left motor when the value is 1. Stops when the value is 0.

`robot.rightMotorON`: Same as above, turns the right motor.

```
robot.leftMotorON = 1;
robot.rightMotorON = 0;
```

The left motor turns and the right motor stops. The body turns clockwise.

---

#### Motor Direction

`robot.leftMotorDirection`: Changes the direction in which the left motor turns. A value of -1 turns the motor forward, while a value of -1 turns it backward.

`robot.rightMotorDirection`: Changes the direction in which the right motor turns. Same as above.

```
robot.leftMotorDirection = 1;
robot.rightMotorDirection = -1;
```

The left motor turns forward and the right motor turns backward. The body turns clockwise.

---

#### Motor Speed

`robot.leftMotorSpeed`: Change the speed at which the left motor turns. If you make it too fast, it may go off course.

`robot.rightMotorSpeed`: Change the speed at which the right motor turns. Same as above.

```
robot.leftMotorSpeed = 3.0;
robot.rightMotorSpeed = 6.0;
```

The right motor turns twice as fast as the left motor.

---

#### Sensor Values

`robot.leftSensorValue`: The value of the sensor on the left side, which takes values from 0~255, with values near 0 indicating that the area directly below the sensor is black, and values near 255 indicating that the area directly below the sensor is white.

`robot.rightSensorValue`: The value of the sensor on the right side. Same as above.

```
if (robot.leftSensorValue > 130) {
  print("Left sensor is white.");
}
if (robot.rightSensorValue < 130) {
  print("Right sensor is black.");
}
```

If the value is below 130, which is about the middle of 0 and 255, it is considered black, and if the value is above 130, it is considered white.
