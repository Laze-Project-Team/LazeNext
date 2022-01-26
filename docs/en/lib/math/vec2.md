# Vector 2D

Represents a two-dimensional vector and is used to represent 2D coordinates, etc.

## Initialization

```
double: x = 0.0;
double: y = 0.0;
Vector2D: vector(x, y);
```

### x

y component of the vector to define as double.

### y

y component of the vector to define as double.

## Properties

### x

x component of the vector.

### y

y component of the vector.

## Method

### length

```
double: length = vector.length();
```

#### Return values

Length of vector2D (positive square root of x²+y²).

### Normalization

```
Vector2D: unitVector = vector.normalize();
```

#### Return values

Normalized vector2D (length 1).

Translated with DeepL