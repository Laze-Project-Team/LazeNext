# Model.rotate()

Allows you to rotate the model about a certain rotation axis.

## Usage

```
Vector3D: axis(1.0, 0.0, 0.0);
double: angle = toRad(90.0);
cube.rotate(axis, angle);
```

### Arguments

#### axis

Axis to rotate the model [Vector3D](/lib/math/vec3).

#### angle

A real number indicating the angle at which to rotate the model. Be careful not to include angles in the degree system (you can also convert the 360 degree system using [toRad](/lib/math/toRad)).

### Return values

None.

Translated with [DeepL](https://www.deepl.com/translator)
