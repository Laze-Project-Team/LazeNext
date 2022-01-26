# Numbers

Describes numbers, which are essential for writing programs.

## Types of numbers

There are four types of variables that represent numbers: `int`, `int32`, `double`, and `char`.

Here is a table that summarizes the characteristics of each.

|Type name|Formal name|Range of values that can be handled|
|:-------|:------------------------------------|:--|
| int32  | Signed 32bit integer                | -2147483648 to 2147483647 (-2^31 to 2^31-1)|
| int    | Signed 64bit integer                |-9223372036854775808～9223372036854775807(-2^63～2^63-1)|
| double | Signed 64-bit floating point number | -2251799813685248～2251799813685247(-2^51～2^51-1) for mantissa part, -1024～1023(-2^10～2^10-1)for exponent part
| char   | Signed 32-bit integer               | -2147483648 to 2147483647 (-2^31 to 2^31-1)|

I've included a bit of in-depth information, but just the basics: `integers` for values without a decimal point, `real numbers` for values with a decimal point, and `characters` if you want to handle characters.

## Type conversion

Laze is designed to operate on different types, and type conversion is automatically (implicitly) performed. Look at the following example.

```
print(5.0 / 3); // 1.666...
```

We are dividing the real number `5.0` by the integer `3`. In this case, the previous type of `5.0` takes precedence, and the overall result is `1.666...`. In this case, the previous type of `5.0` takes precedence and the overall number is `1.666...`.

Let's look at the following example.

```
print(5 / 3.0); // 1
```

We are dividing the integer `5` by the real number `3.0`. In this case, the previous type of `5` takes precedence, and the overall result is the integer `1`.

Translated with [DeepL](https://www.deepl.com/translator)