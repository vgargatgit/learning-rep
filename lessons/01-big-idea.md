# Lesson 1 — The big idea

## Learning objective

Explain why a hidden unit needs a learning signal and how backpropagation supplies one.

## Story

The network produces a prediction by composing several functions. The target tells us whether the final prediction was good, but it does not directly tell each hidden connection how it contributed to the mistake.

This is the **credit-assignment problem**: assign responsibility for the final loss to internal parameters.

Backpropagation solves the computational part of this problem. Starting from the scalar loss, it applies the chain rule in reverse dependency order to calculate the derivative of that loss with respect to every parameter.

## Keep these ideas separate

- **Forward pass:** calculate intermediate values and the prediction.
- **Loss:** assign a scalar score to the prediction.
- **Backpropagation:** calculate gradients.
- **Optimisation:** use gradients to update parameters.
- **Representation learning:** the result of many parameter updates shaping hidden activations.

## Misconception check

> Backpropagation does not move the numerical loss backwards unchanged. It propagates derivatives of the loss with respect to intermediate quantities.
