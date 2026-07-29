#!/usr/bin/env python3
"""Canonical binary-classification backpropagation example.

The implementation intentionally avoids ML frameworks so every intermediate
quantity and derivative remains visible.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import exp, log1p
from typing import Sequence


@dataclass(frozen=True)
class ForwardPass:
    logit: float
    probability: float
    loss: float

    @property
    def z(self) -> float:
        """Backward-compatible name for the logit."""
        return self.logit

    @property
    def prediction(self) -> float:
        """Backward-compatible name for the class-1 probability."""
        return self.probability


@dataclass(frozen=True)
class Gradients:
    weights: tuple[float, ...]
    bias: float


def sigmoid(logit: float) -> float:
    """Compute sigmoid stably."""
    if logit >= 0:
        negative_exp = exp(-logit)
        return 1.0 / (1.0 + negative_exp)
    positive_exp = exp(logit)
    return positive_exp / (1.0 + positive_exp)


def binary_cross_entropy_from_logit(logit: float, target: float) -> float:
    """Compute binary cross-entropy without taking log(0)."""
    if target not in (0.0, 1.0):
        raise ValueError("binary target must be 0 or 1")
    return max(logit, 0.0) - target * logit + log1p(exp(-abs(logit)))


def forward(
    inputs: Sequence[float],
    weights: Sequence[float],
    bias: float,
    target: float,
) -> ForwardPass:
    """Run one binary-classification forward pass."""
    if len(inputs) != len(weights):
        raise ValueError("inputs and weights must have the same length")

    logit = sum(x * w for x, w in zip(inputs, weights, strict=True)) + bias
    probability = sigmoid(logit)
    loss = binary_cross_entropy_from_logit(logit, target)
    return ForwardPass(logit=logit, probability=probability, loss=loss)


def backward(
    inputs: Sequence[float],
    probability: float,
    target: float,
) -> Gradients:
    """Compute binary-classification gradients explicitly."""
    if target not in (0.0, 1.0):
        raise ValueError("binary target must be 0 or 1")

    # Sigmoid plus binary cross-entropy simplifies to dL/dlogit = p - y.
    loss_logit_gradient = probability - target
    weight_gradients = tuple(loss_logit_gradient * x for x in inputs)
    return Gradients(weights=weight_gradients, bias=loss_logit_gradient)


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
    gradients = backward(inputs, before.probability, target)
    new_weights, new_bias = update(weights, bias, gradients, learning_rate)
    after = forward(inputs, new_weights, new_bias, target)

    print("Canonical binary-classification backpropagation calculation")
    print("-" * 58)
    print(f"inputs                    = {inputs}")
    print(f"weights                   = {weights}")
    print(f"bias                      = {bias:.8f}")
    print(f"classification logit z    = {before.logit:.8f}")
    print(f"class-1 probability p     = {before.probability:.8f}")
    print(f"binary target y           = {target:.0f}")
    print(f"binary cross-entropy loss = {before.loss:.8f}")
    print(f"weight gradients          = {gradients.weights}")
    print(f"bias gradient             = {gradients.bias:.8f}")
    print(f"new weights               = {new_weights}")
    print(f"new bias                  = {new_bias:.8f}")
    print(f"new class-1 probability   = {after.probability:.8f}")
    print(f"new BCE loss              = {after.loss:.8f}")
    print(f"loss decreased            = {after.loss < before.loss}")


if __name__ == "__main__":
    main()
