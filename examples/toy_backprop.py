#!/usr/bin/env python3
"""Canonical scalar backpropagation example used by the learning project.

The implementation intentionally avoids ML frameworks so every intermediate
quantity and derivative remains visible.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import exp
from typing import Sequence


@dataclass(frozen=True)
class ForwardPass:
    z: float
    prediction: float
    loss: float


@dataclass(frozen=True)
class Gradients:
    weights: tuple[float, ...]
    bias: float


def sigmoid(z: float) -> float:
    """Compute the logistic sigmoid with a stable branch for large magnitudes."""
    if z >= 0:
        negative_exp = exp(-z)
        return 1.0 / (1.0 + negative_exp)
    positive_exp = exp(z)
    return positive_exp / (1.0 + positive_exp)


def forward(
    inputs: Sequence[float],
    weights: Sequence[float],
    bias: float,
    target: float,
) -> ForwardPass:
    """Run a forward pass for one sigmoid neuron with half squared-error loss."""
    if len(inputs) != len(weights):
        raise ValueError("inputs and weights must have the same length")

    z = sum(x * w for x, w in zip(inputs, weights, strict=True)) + bias
    prediction = sigmoid(z)
    loss = 0.5 * (prediction - target) ** 2
    return ForwardPass(z=z, prediction=prediction, loss=loss)


def backward(
    inputs: Sequence[float],
    prediction: float,
    target: float,
) -> Gradients:
    """Compute gradients by explicitly multiplying local derivatives."""
    dloss_dprediction = prediction - target
    dprediction_dz = prediction * (1.0 - prediction)
    dloss_dz = dloss_dprediction * dprediction_dz

    weight_gradients = tuple(dloss_dz * x for x in inputs)
    return Gradients(weights=weight_gradients, bias=dloss_dz)


def update(
    weights: Sequence[float],
    bias: float,
    gradients: Gradients,
    learning_rate: float,
) -> tuple[tuple[float, ...], float]:
    """Apply one gradient-descent update."""
    if learning_rate <= 0:
        raise ValueError("learning_rate must be positive")
    if len(weights) != len(gradients.weights):
        raise ValueError("weights and weight gradients must have the same length")

    new_weights = tuple(
        weight - learning_rate * gradient
        for weight, gradient in zip(weights, gradients.weights, strict=True)
    )
    new_bias = bias - learning_rate * gradients.bias
    return new_weights, new_bias


def main() -> None:
    inputs = (1.0, 2.0)
    weights = (0.3, 0.7)
    bias = 0.5
    target = 1.0
    learning_rate = 0.1

    before = forward(inputs, weights, bias, target)
    gradients = backward(inputs, before.prediction, target)
    new_weights, new_bias = update(weights, bias, gradients, learning_rate)
    after = forward(inputs, new_weights, new_bias, target)

    print("Canonical toy backpropagation calculation")
    print("-" * 44)
    print(f"inputs             = {inputs}")
    print(f"weights            = {weights}")
    print(f"bias               = {bias:.8f}")
    print(f"pre-activation z   = {before.z:.8f}")
    print(f"prediction y_hat   = {before.prediction:.8f}")
    print(f"target y           = {target:.8f}")
    print(f"loss               = {before.loss:.8f}")
    print(f"weight gradients   = {gradients.weights}")
    print(f"bias gradient      = {gradients.bias:.8f}")
    print(f"new weights        = {new_weights}")
    print(f"new bias           = {new_bias:.8f}")
    print(f"new prediction     = {after.prediction:.8f}")
    print(f"new loss           = {after.loss:.8f}")
    print(f"loss decreased     = {after.loss < before.loss}")


if __name__ == "__main__":
    main()
