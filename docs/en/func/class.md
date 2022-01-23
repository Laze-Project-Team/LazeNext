# Class

A class is a feature that allows you to define your own type, and it can have different functions from ordinary types. Take a look at this code first.

```
class: Car {
	int:position;
	int:speed;

	function: Car (int:Initial position, int:Initial key) => () {
		position = initial position;
		speed = 0;
		key = initial key;
	}

	function: move () => () {
		position += speed;
	}

	function: accelerate (int: intensity) => () {
		speed += intensity;
	}

	function: brake (int: intensity) => () {
		speed -= intensity;
	}

	function: authentication (int: authKey) => (boolean: success) {
		success = (authKey == key);
	}

	Private :
		int: Key;
}

function: main () => () {
	Car: Sedan(0, 10294);

	Sedan.accelerate(10);
	Sedan.move();
	Sedan.brake(5);

	print(Sedan.position);

	// print(Sedan.key);
}
```

This is a bit long code, but let's see how it works from above.

## Declaration

The first line declares a class named "car" with the keyword `class`.

From the second line, variables and functions are declared, all of which are called "members" of the class.

## Constructor

When a function with the same name as the class name is declared as a member, the function becomes a "constructor". A constructor is the first function called when a class is used. In this example, a variable named "sedan" of type "car" is declared in line 31, and the constructor is called there. In this case, the initial position is `0` and the initial key is `10294`. Variables of this class type are called objects.

## Accessing members of an object

To access the members of an object, use a period like `. `. For example, `car. Position` means that you are accessing the member "position" of the object "car". Also, members with values such as variables are called "[properties](#Properties)", and members of functions are called "[methods](#Methods)".

In addition, access can be restricted by the keywords `public` and `private`. The `public` keyword allows access from anywhere, while the `private` keyword allows access only from within the class. If you don't add any keywords, it will automatically be `public`. These features are for safety, and you don't need to use them if you are not familiar with them.

Here, the property `key` is set to private. Therefore, if you try to access it from outside the object, as in line 39, which is commented out, you will get an error.

## Properties

Members of a class that have values, such as variables, are called properties. Properties are defined as

```
<variable name>.<property name>.
```
A property can be accessed with `<variable name>` and can refer to values in an object. However, when calling from within an object, the `<variable name>` part is not necessary.

You can see that the object's properties are referenced and changed in functions such as move, accelerate, and brake.

## Methods

Among the members of a class, functions other than the constructor are called methods. Methods are defined as

```
<variable name>.<method name>( <argument> );
```

and can perform various operations on objects. However, when calling from within an object, the `<variable name>`. However, if you call it from within an object, you don't need the `<variable name>`.

In the part starting from line 33, the gas pedal is used to speed up the car, then it is moved, and the brake is used to slow it down. We are displaying the position of the car after that, so you can see that the position here is `10`.

## Inheritance

Classes can be extended in type by using a feature called inheritance. See the following code.

```
class: Car {
	int: position;
	int: speed;

	function: Car (int: initialPosition, int: initialKey) => () {
		position = initialPosition;
		speed = 0;
		key = initialKey;
	}

	function: Authentication (int: authKey) => (boolean: success) {
		success = (authKey == key);
	}

	Private:
		int: Key;
}

class: Truck <- Car {
	int: cargo;

	function: Truck (double: cargo, int: initialKey) => () {
		position = 0;
		speed = 3;
		Luggage = load;
		key = initialKey;
	}

	private:
		int: key;
}

function: main () => () {
	Track: Hino(10, 10294);
	Hino.position = 5;
	print(Hino.Authentication(10294));
}
```

In line 21, class inheritance occurs. In line 21, we declare a class called "truck" by inheriting from a class called "car". By inheriting, it inherits the properties "position", "speed", and "key", and the method "authentication", which are all members of "car"." The function "car" is not inherited because it is a [constructor](#Constructor).

Translated with DeepL