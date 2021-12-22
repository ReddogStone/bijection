# Bijection

An implementation of the bijection abstraction in JavaScript.
A bijection is represented by two functions `forward` and `backward`.
Bijections conform to an Arrow-like interface in the Haskell sense (https://en.wikibooks.org/wiki/Haskell/Understanding_arrows)
and can be combined in various ways.

# Motivation

Data schemas are often used to validate the format and content of data.
Usually schemas only provide a way to validate but not convert this data into a different format.
Bijections bridge this gap, since they can be used for back- and forth conversions and at
the same time describe the shape of the data.

This library is intended to provide a simple way of writing bijective data schemas in JavaScript.
