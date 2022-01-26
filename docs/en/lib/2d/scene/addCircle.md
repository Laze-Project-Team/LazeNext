# Scene2D.addCircle

Method to add a circle to the scene.

## Usage

```
double: radius = 5;
Vector2D: coordinates(1.0, 2.0);
Vector3D: color(0.2, 0.5, 0.7);
doubles: zindex = 10;
double: id = Scene.addCircle(radius, coordinates, color, zindex);
```

### Arguments

#### radius

The radius of the circle as a real number.

#### coordinates

Coordinates of the center of the circle in [Vector2D](/lib/math/vec2)

#### color

Specify the color of the circle using [Vector3D](/lib/math/vec3).

Colors are specified in RGB order

#### zindex

Specify the overlapping order of circles by real number.

The higher the order of overlap, the closer the circles will be drawn.

### Return values

#### id

Returns the id of the added circle.

This is used when processing [Sprite](/lib/2d/sprite/index), such as rotation and movement.

Translated by DeepL