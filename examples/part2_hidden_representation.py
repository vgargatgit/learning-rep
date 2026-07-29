"""Part 2: transform an input vector into a hidden representation."""

from __future__ import annotations

from math import exp
from typing import Sequence


def sigmoid(value: float) -> float:
    """Return the logistic sigmoid of one scalar."""
    return 1.0 / (1.0 + exp(-value))


def hidden_representation(
    inputs: Sequence[float],
    weights: Sequence[Sequence[float]],
    biases: Sequence[float],
) -> tuple[tuple[float, ...], tuple[float, ...]]:
    """Compute pre-activations and activations for a dense sigmoid layer."""
    if len(weights) != len(biases):
        raise ValueError("each hidden unit must have one bias")

    pre_activations: list[float] = []
    activations: list[float] = []

    for unit_index, (weight_row, bias) in enumerate(
        zip(weights, biases, strict=True),
        start=1,
    ):
        if len(weight_row) != len(inputs):
            raise ValueError(
                f"hidden unit {unit_index} has {len(weight_row)} weights "
                f"for {len(inputs)} input features"
            )

        z = sum(
            weight * feature
            for weight, feature in zip(weight_row, inputs, strict=True)
        ) + bias
        pre_activations.append(z)
        activations.append(sigmoid(z))

    return tuple(pre_activations), tuple(activations)


def main() -> None:
    inputs = (1.0, 2.0)
    weights = (
        (0.50, -0.25),
        (0.25, 0.50),
    )
    biases = (0.10, -0.20)

    pre_activations, hidden = hidden_representation(inputs, weights, biases)

    print(f"Input representation x: {inputs}")
    for index, (z, activation) in enumerate(
        zip(pre_activations, hidden, strict=True),
        start=1,
    ):
        print(f"Hidden unit {index}: z{index}={z:.8f}, h{index}={activation:.8f}")
    print(f"Hidden representation h: {hidden}")


if __name__ == "__main__":
    main()
