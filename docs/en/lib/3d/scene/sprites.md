# Scene.sprites

Scene.sprites is an array<*[Model](/lib/3d/model/index)> that stores the objects in the world.

## Usage

Scene.sprites To get the elements of a sprite, use the scene. Use the ID you got from add cube.

```
double: size = 1.0;
vector3D: color(1.0, 0.0, 0.0); 
Vector3D: coordinates(0.0, 0.0, 0.0);
int: id = world.addCube(size, color, coordinates);
world.sprites.get(id) -> scale(0.5, 0.5, 0.5);
```

Scene.sprites elements are pointers, so we use the `->` symbol to access the object members.

Translated with [DeepL](https://www.deepl.com/translator)
