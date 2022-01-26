# Camera

The camera class is a class that controls the viewpoint in the world.

## Methods

You can control the camera with these methods:

### [Camera.Camera()](/lib/3d/constructor) (class constructor)

This function is called when you create a camera object.

### [camera.setSensitivity()](/lib/3d/camera/setsensitivity)

Allows you to set the sensitivity of the camera. (Default is 0.1).

### [Camera.setSpeed](/lib/3d/camera/setspeed)

Allows you to set the camera speed. (Default is 5.0).

### [Camera.update()](/lib/3d/camera/update)

Moves the camera in response to user input. (Not recommended to use. You can no longer use [scene.draw()](/lib/3d/scene/draw))

## Properties

These members represent the data of the camera:

### Camera.coordinates

This property is the coordinates of the camera.

### Camera.sensitivity

This property is the sensitivity of the camera. It can be changed in [Camera.setSensitivity()](/lib/3d/camera/setsensitivity).

### Camera.speed

This property is the speed of the camera. It can be changed in [Camera. setSpeed()](/lib/3d/camera/setspeed).

Translated with DeepL
