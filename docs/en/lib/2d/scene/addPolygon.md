# Scene2D.addPolygon

Method to add a polygon to the scene.

## Usage

```
Array<*Vector2D>: vertices;
Vector2D: VertexA(0.0, 0.0);
Vertex.push(vertex A);
Vector2D: vertexB(0.0, 5.0);
Vertex.push(vertexB);
Vector2D: vertexC(5.0, 0.0);
Vertex.push(vertexC);
double: magnitude = 1.0;
Vector2D: coordinates(1.0, 2.0);
Vector3D: color (0.2, 0.5, 0.7);
double numbers: zindex = 10;
double: id = Scene.addPolygon(vertices, size, coordinates, color, zindex);
```

### Arguments

#### vertices

An array of [Vector2D](/lib/math/vec2) coordinates of the polygon vertices to add.

#### size

The size of the polygon to add, as a real number

#### coordinates

Specify xy coordinates of the polygon to be added in [Vector2D](/lib/math/vec2)

#### color

Specify the color of the added polygon with [Vector3D](/lib/math/vec3).

Colors are specified in RGB order

#### zindex

Specify the order of overlapping polygons by real number.

The higher the overlap order, the closer the polygons will be drawn.

### Return values

#### id

Returns the id of the added polygon.

This is used when processing [Sprite](/lib/2d/sprite/index), such as rotation and movement.

Translated with [DeepL](https://www.deepl.com/translator)