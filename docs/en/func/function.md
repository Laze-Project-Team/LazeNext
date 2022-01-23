# Functions

Understanding functions is very important because Laze performs various operations by declaring and calling functions.	

## Declaration

You can declare a function in the following form

```
function: <function name> ( <argument> ) => ( <return value> ) {
	<process>
}
```

`<function name>` is the function name of the function.

`<argument>` is the argument of the function (optional). Arguments are the values required to process the function when the function is called. See [Arguments](#Arguments) for details.

`<return value>` is the return value of the function (optional). The return value contains the value that will be returned after the function finishes processing. For details, see [Return Values](#Return Values).

For details, see [Return Value](#Return Value).

The `<process>` field contains the specific process to be performed by the function.

## Calling

A function call is made in the following form.

```
<function name>( <argument> );
```

where `<function name>` is the function name of the function.

`<argument>` is the argument to be specified when calling the function (optional).

If you want to receive the return value, put it in a variable or enter it as it is as an argument of another function.

## Arguments

You can pass values, called `arguments`, to a function. Let's look at the following example.

```
function: addition (int: variableA, int: variableB) => (int: result) {
	result = variableA + variableB;
}
```

Declares a function `add` that takes `integer A` and `integer B` as arguments and returns their sum. Arguments are declared in the same way as variables, as `<type>:<name>`, in the left parenthesis. You can have as many arguments as you like.

## Return value

Declared in the right parenthesis in the form of `<type>:<name>`, same as arguments. Unlike arguments, only one return value can be declared. As shown in the code above, it returns a value in the same form as a variable assignment.