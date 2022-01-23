# Scene.addLight()

This function allows you to add a light source to the world.

## Usage

```
double: magnitude = 1.0;
vector3D: color(1.0, 0.0, 0.0);
Vector3D: coordinates(0.0, 0.0, 0.0);
int: id = world.addLight(size, color, coordinates);
```

### Arguments

#### size

A real number representing the length of a side.

#### color

Color of the light source [Vector3D](/lib/math/vec3). x, y, and z properties represent the intensity of red, green, and blue, respectively, as real numbers from 0.0~1.0.

#### Coordinates

Coordinates of the light source [Vector3D](/lib/math/vec3).

### Return Values

This function returns the integer ID of this object in the world. This ID can be used to retrieve the element in the scene class sprite array that corresponds to this object.

Example

```
// Continuation of the above program
int: id = world.addLight(size, color, coordinates);
world.sprites.get(id) -> draw();
```

Translated by DeepL
