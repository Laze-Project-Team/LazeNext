# Scene2D.addRect

Method to add a rectangle to the scene.

## Usage

```
double: width = 30;
double: height = 20;
Vector2D: coordinates(1.0, 2.0);
Vector3D: color(0.2, 0.5, 0.7);
double: zindex = 10;
double: id = Scene.addRect(width, height, coordinates, color, zindex);
```

### Arguments

#### width

The width of the rectangle as a real number.

#### height

The height of the rectangle as a real number.

#### coordinates

Specify the coordinates of the rectangle in [Vector2D](/lib/math/vec2).

#### color

Specify the color of the rectangle using [Vector3D](/lib/math/vec3).

Colors are specified in RGB order

#### zindex

Overlap order of quadrilaterals as a real number.

The higher the overlap order, the closer the rectangle will be drawn.

### Return value

#### id

Returns the id of the added rectangle.

This is used when processing [Sprite](/lib/2d/sprite/index), such as rotation and movement.

Translated with [DeepL](https://www.deepl.com/translator)