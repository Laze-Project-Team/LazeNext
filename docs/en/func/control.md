# Control statements

A syntax used to make a program change its processing depending on a condition or to repeat a similar process.

## if

### Syntax

```
if ( <condition expression> ) {
	// Execute only if <condition expression> is true
	<process>
} else {
	// execute only if <condition> is false
	<process>
}
```

The most basic control statement. The process to be performed can be changed depending on the condition. The following part from `else` can be omitted.

### Usage examples

```
If ( variable < 10 ) {
	display("Variable is less than 10");
}
```

## from to

## Syntax

```
( <initial condition> ) from ( <end condition> ) to ( <loop process> ) {
	// Process to be repeated
	<process>
}
```

Declare variables to be used in the loop with `<initial condition>`.

The `<end condition>` specifies the end condition. The loop will be terminated when this condition becomes true.

`<loop process>` specifies the process to be executed when the loop does not end. It is often used to increase a variable that is a counter.

### Usage example

```
(int: counter = 0;) to (counter == 10) (counter++;) {
	print(counter);
}
```

## repeat

## Syntax

```
repeat ( <loop count> ) {
	// Process to be repeated
	<process>
}
```

Syntax to repeat a specified number of times.

### Usage example

```
repeat (5) {
	print("It is repeated 5 times");
}
```

## break

## Syntax

```
{
	// In some kind of loop
	break;
}
```

Can be used in a loop to exit the loop.

### Usage example

```
(int: counter = 0;) to (counter == 10) (counter++;) {
  If (counter > 5){
		break;
	}
	print(counter);
}
```

## continue

## Syntax

```
{
	// In some kind of loop
	continue;
}
```

Unlike `exit`, this will terminate the loop in the middle of a loop and move on to the next one. If you don't understand this explanation, you may want to run the usage example.

### Usage example

```
from (int: counter = 0;) to (counter == 10) (counter++;) {
	if (counter % 3 == 0) {
		continue;
	}
		
	print(counter);
}
```

## loop

## Syntax

```
loop {
	// Process to infinite loop.
	<process>
}
```

The infinite loop is a function used for drawing in games and is called 60 times per second.

### Usage examples

```
int: counter = 0;
loop {
	print(counter);
	counter++.
}
```

Translated with [DeepL](https://www.deepl.com/translator)