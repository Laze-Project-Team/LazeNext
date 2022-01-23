# Scene2D.Scene2D

Class constructor to be called when scene 2D is initialized.

## Usage

```
double: height = 100;
Vector3D: backgroundColor(0.2, 0.2, 0.2);
Scene2D: scene(height, backgroundColor);
```

### Arguments

#### height

Height of the scene as a real number.

This is the standard for adding squares, circles, etc.

The width will be automatically set to 16:9 aspect ratio.

#### BackgroundCobor

Specify the background color of the scene using [Vector3D](/lib/math/vec3)

The colors are specified in RGB order.

### Return values

None

Translated by DeepL