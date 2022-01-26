# Model.Model()

This function is the constructor for the model class.

## Usage

```
double: vertexData[12][3][6] = [...]. ;
int: vertexCount = 36;
vector3D: color(0.2, 0.5, 0.7);
Vector3D: coordinates(0.0, 0.0, 0.0);
int: shaderID = 0;
Model: cube(&vertexData, vertexCount, color, coordinates, shaderID);
```

### Arguments

#### vertexData

Pointer to an array of real numbers representing the vertex data of the model.

### vertexCount

An integer indicating how many vertices are in the model.

### color

The color of the model [Vector3D](/lib/math/vec3).

### coordinates

The coordinates of the model [Vector3D](/lib/math/vec3).

### shaderID

The ID of the shader to use when drawing the model.

|  object type  | ID |.
|---------------|----|
| normal object | 0 |
| Light source  | 1 |

### Return Values

None

Translated with DeepL
