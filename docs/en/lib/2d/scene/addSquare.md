# Scene2D.AddSquare

Method to add a square to the scene.

## Usage

```
double: size = 1.0;
vector2D: coordinates(1.0, 2.0);
Vector3D: color(0.2, 0.5, 0.7);
doubles: zindex = 10;
Scene.addSquare(size, coordinates, color, zindex);
```

### Arguments

#### size

The size of the square to add, as a real number.

#### coordinates

The xy coordinates of the square to add, in [Vector2D](/lib/math/vec2)

#### color

Specify the color of the added square using [Vector3D](/lib/math/vec3)

Colors are specified in RGB order

#### zindex

Specifies the overlap order of the squares to be added as a real number.

The higher the overlap order, the closer the squares will be drawn.

### Return value

#### id

Returns the id of the added square.

It is used when processing [Sprite](/lib/2d/sprite/index) such as rotation and movement.

Translated by DeepL