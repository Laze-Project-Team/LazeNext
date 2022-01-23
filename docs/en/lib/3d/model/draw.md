# Model.draw()

Allows you to draw the model. Usually called by [Scene.draw()](/lib/3d/scene/draw), so it is not necessary (and not recommended) for the user to use this function.

## Usage

```
matrix4x4: projectionMatrix();
projectionMatrix = perspectiveMat3D(projectionMatrix, 75.0, 1280.0, 720.0, 0.1, 100.0);
matrix4x4:viewMatrix();
viewMatrix = Eye.Update(xOffset, yOffset, elapsedTime);
Vector3D: cameraCoordinates(1.0, 0.0, 0.0);
cube.draw(projection matrix, view matrix, camera coordinates);
```

### Arguments

#### projectionMatrix

A [Matrix 4x4](/lib/3d/matrix4x4) showing the projection matrix of the world. You can read more about it at [this website](http://www.sousakuba.com/Programming/d3d_camera.html).

#### viewMatrix

A [Matrix 4x4](/lib/3d/matrix4x4) that shows the view matrix of the camera. Read more about it at [this website](http://www.sousakuba.com/Programming/d3d_camera.html).

#### Camera coordinates

The coordinates of the camera in the world [Vector3D](/lib/math/vec3).

### Return Values

None