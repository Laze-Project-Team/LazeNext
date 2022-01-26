# Sprite.Sprite

Class constructor called when a sprite is initialized.

It is usually called from [Scene2D](/lib/2d/scene/index), [addSquare](/lib/2d/scene/addSquare), [addRect](/lib/2d/scene/addRect), [addCircle](/lib/2d/scene/addCircle).

## Usage

```
double: data = 1;
int: pnum = 2;
int32: index = 3;
int: vnum = 4;
Vector3D: color(0.2, 0.5, 0.7);
vector2D: coordinates(1.0, 2.0);
int: shaderID = 1;
Real: zindex = 10;
Sprite: Rectangle(data, pnum, index, vnum, color, coordinates, shaderID, zindex);
```

### Arguments

#### data

#### pnum

#### index

#### vnum

#### color

Specify the color of the rectangle with [Vector3D](/lib/math/vec3).

Colors are specified in RGB order

#### coordinates

Specify the coordinates of the rectangle in [Vector2D](/lib/math/vec2).

#### shaderID

#### zindex

Specifies the overlap order of the quadrangles as a real number.

The higher the overlap order, the closer the rectangle will be drawn.

### Return values

None

Translated with DeepL