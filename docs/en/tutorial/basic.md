# Basics

Let's learn the basic usage of Laze.

This section is written assuming you are a beginner in programming, so intermediate and advanced users may understand many parts.

## First steps

Let's start by writing this program.

````
function: main () => () {
	print("Welcome to Laze!");
}
```

Once written, let's run it. In the output screen below, you should see "Welcome to Laze! in the output screen below. Let's take a closer look at how this program works.

Let's take a look at how the first program works, breaking it down one by one.

## Functions

The keyword "function" at the very beginning indicates that we are declaring a function. A function is something that performs an action or process.

It is declared as

````
function: <function name> ( <argument> ) => ( <return value> ) {
	<process> 
}
```

and is called as

```
<function name>( <argument> );
```

Arguments and return values are explained in [Function](/func/function).

In other words, in your first program, you have defined a function named "main". The function named "main" is a special function, and it is executed first when the program is executed.

## scope

Next, let's look at the part enclosed in `{}`. The `{}` forms a "scope", which simply means that you can access the outside from the inside of the scope, but not the inside from the outside.

![scope.jpg](/img/docs/scope.jpg)

## Standard functions

````
print("Welcome to Laze!");
```

Let's take a look at the above program. The `print()` means to execute a function named print. Show is a standard function, see [print](/func/functions/show) for details.

## string

`""` is a double quotation mark, and the part enclosed by two double quotation marks is called a "string". `""` can also represent a string, but with `'"` (single quotation marks), it is not a "string" but a "character". See [character](/func/char) and [stirng](/func/string) for more information here.

## Semicolon

Did you notice that there is a `;` at the end of the line? A semicolon, usually written at the end of a line, indicates that a single process is about to end. It does not necessarily have to be at the end of the line, and in extreme cases, it is possible to write the first program on a single line. （In extreme cases, it is possible to write the first program on a single line, although it is usually better to start a new line for better readability.)

## Variables

Next, let's look at this program.

````
function: main() => () {
	int: result = (2 + 3) * (6 - 4) / (9 % 7);
	print(result);
} 
``

In the `int: result` section, we declare a "variable" named result. A variable is, as you can read, a number that changes. A variable is a number that changes. You can imagine it like the following figure.

![variable.jpg](/img/docs/variable.jpg)

Also, in Laze, there is a concept of "types" for variables.

## type

A type is like a shape of a variable box, and only things that fit that shape will fit in that box. There are two main types: numbers and objects.

### Numeric

There are four types of numbers: `int32`, `int`, `double`, and `char`.

See [number](/func/number) for the difference between `int32` and `int`. If you have any trouble, just use `int` (64-bit integers).

However, `int32` and `int` cannot represent numbers with decimal places such as 1.5 and 3.14. In such cases, `double` are used.
However, because of the characteristics of floating point, the value may shift slightly when calculating a number with many digits. However, it is not likely to be a problem in most cases.

A `char` is enclosed in a single quotation mark, such as `''`.

### Character strings

Characters in everyday use are called "strings" in programming terminology. Strings are enclosed in double quotation marks, such as `""`.

### Objects

An object is a type that contains `string` and so on. It can also define its own type, and this feature enables object-oriented programming.

## Operators

Operators are symbols such as `+`, `-`, `=`, and `>`. Among them, those used for calculations are called "arithmetic operators", those used for comparing, matching, and disagreeing numerical values are called "comparison operators", and those used to create more complex conditional expressions by combining multiple conditional expressions are called "logical operators". (There is no need to memorize the names, though.)

For a list of specific operators, please see [operator](/func/operator).

If you know the arithmetic operators, you may be able to understand what is displayed in a [variable](#variable) program.

```
(2 + 3) * (6 - 4) / (9 % 7)
```

means that `2 + 3 = 5`, `6 - 4 = 2`, and `9 % 7 = 2`, which means that the whole thing represents `5 * 2 / 2`. That is, `5` should be displayed.

## Control statement

There are times when conditional branching is necessary in the middle of a program. Also, there are times when you want to repeat the same process many times. The [control statement](/func/control) is used in such cases.

The conditional branch [also](/func/control#moshi), the repetitions [from to](/func/control#to), [times](/func/control#times), [infinite loop](/func/control#infinite loop), and the loop control [exit ](/func/control#exit), and [next](/func/control#next) of loop control.

## comment

The comment part is ignored when executing the program, so you can use it to insert explanatory text or other information in the program. Commenting is called commenting out, and in an editor you can comment out a selected line by pressing `Ctrl + /`. There are two types of comments: "line comments" and "block comments".

### Line comments

````
// You can comment out one line

Integer:variable; // can be done in the middle of a line

function: main() => () { // you can do this
	print("Welcome to Laze!");
} // You can do this!
````

line, i.e. a line, so you can comment out a line. It is also possible to start in the middle of a line.

### block comment

```
/*

Multiple lines can be
together.
comment out
can be commented out ^^.

*/

print("This is not displayed -> "/* You can also comment out only a part of a line */);
````

You can comment out multiple lines at once. If you use the comment-out function of the editor, all lines will be commented out, so you may not have many opportunities to use it.

Translated with DeepL