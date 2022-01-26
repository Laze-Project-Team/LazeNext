# Vector 3D

Represents a three-dimensional vector, used to represent 3D coordinates, colors, etc.

## Initialization

```
double: x = 0.0;
double: y = 0.0;
double: z = 0.0;
Vector3D: vector(x, y);
```

### x

y component of the vector to define as double.

### y

y component of the vector to define as double.

### z

z component of the vector to define as double.

## Properties

### x

x component of the vector.

### y

y component of the vector.

### z

z component of the vector.

## Method

### length

```
double: length = vector.length();
```

#### Return values

Length of vector3D (positive square root of x²+y²+z²).

### Normalization

```
Vector3D: unitVector = vector.normalize();
```

#### Return values

Normalized vector3D (length 1).

Translated with DeepL