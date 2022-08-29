# Basics

Now let's learn how to use Laze in a basic way.

💡 The following programming descriptions are intended for beginners in programming, so intermediate and advanced users may understand many parts of the information.

## The First Steps

Let's start by writing this program.

```
function: main () => () {
	print("Welcome to Laze!");
}
```

As soon as it is written, it will be executed. On the screen in the output below, "Welcome to Laze!" should appear on the display. We will now explain in detail how this.

How does the first program work? We will look at them one by one, breaking them down.

## Function

The very first keyword 'function' indicates that a function is to be declared. A function is something that performs some action or process,

which can be indicated by (the one below)

```
function: <function name> ( <argument> ) => ( <return value> ) {
	<process> 
}
```

and called by (like the one below)

```
<function name>( <argument> );
```
The "arguments" and "return values" are explained in [Function](/func/function).

This means that in the first program you defined a function named "main". The function named "main" is a special function, a system in which this function is executed first when the program is executed.

## Scope

Next, let's look at the areas enclosed by `{}`. The `{}` forms a "scope", which simply means that you can access the inside of a scope from the outside, but not the inside from the outside.

![scope image picture](/img/docs/en/scope.jpg)

## Standard functions

```
print("Welcome to Laze!");
```

Let's look at the above form. 'print()' means to execute a function named print. For more information on the function 'print', which is a type of standard function, please see [print](/func/functions/print).

## String

`""` is a double quotation mark and the area enclosed by two double quotation marks is called a 'string'. You cannot use `''` (single quotation marks) because it is not a 'string' but a 'character'. For more information on this, see [character](/func/char) and [stirng](/func/string).

## Semicolon

Did you notice the `;` at the end of the line? This is called a semi-colon and is written at the end of a line to indicate the end of one process. However, it does not necessarily have to be at the end of a line, and extreme cases it is possible to write the first program on a single line. (By convention, a line break is used for readability).

## Variables

Next, let's look at this program.

```
function: main() => () {
	int: result = (2 + 3) * (6 - 4) / (9 % 7);
	print(result);
} 
```

In the `int: result` section, we declare a "variable" named result. A variable is, as you can read, a number that changes. A variable is a number that changes. You can imagine it like the following figure.

![variable image picture](/img/docs/en/variable.jpg)

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

If you know the arithmetic operators, you may be able to understand what is displayed in a [variable](#Variables) program.

```
(2 + 3) * (6 - 4) / (9 % 7)
```

means that `2 + 3 = 5`, `6 - 4 = 2`, and `9 % 7 = 2`, which means that the whole thing represents `5 * 2 / 2`. That is, `5` should be displayed.

## Control statement

There are times when conditional branching is necessary in the middle of a program. Also, there are times when you want to repeat the same process many times. The [control statement](/func/control) is used in such cases.

The conditional branch [also](/func/control#if), the repetitions [from to](/func/control#from to), [repeat](/func/control#repeat), [loop](/func/control#loop), and the loop control [exit ](/func/control#exit), and [next](/func/control#next) of loop control.

## comment

The comment part is ignored when executing the program, so you can use it to insert explanatory text or other information in the program. Commenting is called commenting out, and in an editor you can comment out a selected line by pressing `Ctrl + /`. There are two types of comments: "line comments" and "block comments".

### line comments

```
// You can comment out one line

Integer:variable; // can be done in the middle of a line

function: main() => () { // you can do this
	print("Welcome to Laze!");
} // You can do this!
```

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
```

You can comment out multiple lines at once. If you use the comment-out function of the editor, all lines will be commented out, so you may not have many opportunities to use it.

Translated with [DeepL](https://www.deepl.com/translator)