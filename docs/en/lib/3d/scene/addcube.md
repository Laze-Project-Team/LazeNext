# Scene.addCube()

This function allows you to add a cube that can be moved and drawn in the world.

## Usage

```
double: size = 1.0;
Vector3D: color(1.0, 0.0, 0.0);
Vector3D: Coordinates(0.0, 0.0, 0.0);
int: id = world.addCube(size, color, coordinates);
```

### Arguments

#### size

A real number representing the length of a side.

#### color

The color of the cube [vector3D](/lib/math/vec3). x, y, and z properties represent the intensity of red, green, and blue, respectively, as real numbers from 0.0 to 1.0.

#### Coordinates

Coordinates of a cube [vector3D](/lib/math/vec3).

### Return Values

This function returns the integer ID of this object in the world. This ID can be used to get the elements of the sprite array of the scene class.

Example

```
// Continuation of the above program
int: id = world.addCube(size, color, coordinates);
world.sprites.get(id) -> draw();
```