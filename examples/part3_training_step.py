"""Part 3: one explicit training step through a 2 -> 2 -> 1 network."""

from __future__ import annotations

from dataclasses import dataclass
from math import exp, log
from typing import Sequence


Vector = list[float]
Matrix = list[list[float]]


@dataclass
class Model:
    hidden_weights: Matrix
    hidden_biases: Vector
    output_weights: Vector
    output_bias: float


@dataclass(frozen=True)
class ForwardPass:
    hidden_pre_activations: tuple[float, float]
    hidden: tuple[float, float]
    logit: float
    prediction: float
    loss: float


@dataclass(frozen=True)
class TrainingStep:
    before: ForwardPass
    after: ForwardPass


def sigmoid(value: float) -> float:
    if value >= 0:
        negative_exp = exp(-value)
        return 1.0 / (1.0 + negative_exp)
    positive_exp = exp(value)
    return positive_exp / (1.0 + positive_exp)


def binary_cross_entropy(prediction: float, target: float) -> float:
    epsilon = 1e-12
    clipped = min(max(prediction, epsilon), 1.0 - epsilon)
    return -(target * log(clipped) + (1.0 - target) * log(1.0 - clipped))


def initial_model() -> Model:
    return Model(
        hidden_weights=[[0.50, -0.25], [0.25, 0.50]],
        hidden_biases=[0.10, -0.20],
        output_weights=[0.80, -0.60],
        output_bias=0.05,
    )


def forward(model: Model, inputs: Sequence[float], target: float) -> ForwardPass:
    if len(inputs) != 2:
        raise ValueError("this teaching example expects exactly two input features")

    hidden_z = [
        sum(weight * feature for weight, feature in zip(row, inputs, strict=True)) + bias
        for row, bias in zip(model.hidden_weights, model.hidden_biases, strict=True)
    ]
    hidden = [sigmoid(value) for value in hidden_z]
    logit = sum(
        weight * activation
        for weight, activation in zip(model.output_weights, hidden, strict=True)
    ) + model.output_bias
    prediction = sigmoid(logit)
    loss = binary_cross_entropy(prediction, target)

    return ForwardPass(
        hidden_pre_activations=(hidden_z[0], hidden_z[1]),
        hidden=(hidden[0], hidden[1]),
        logit=logit,
        prediction=prediction,
        loss=loss,
    )


def train_step(
    model: Model,
    inputs: Sequence[float],
    target: float,
    learning_rate: float,
) -> TrainingStep:
    if learning_rate <= 0:
        raise ValueError("learning_rate must be positive")

    before = forward(model, inputs, target)

    # Sigmoid + binary cross-entropy gives dL/dlogit = prediction - target.
    output_delta = before.prediction - target

    output_weight_gradients = [
        output_delta * activation for activation in before.hidden
    ]
    output_bias_gradient = output_delta

    hidden_activation_gradients = [
        output_delta * weight for weight in model.output_weights
    ]
    hidden_deltas = [
        activation_gradient * activation * (1.0 - activation)
        for activation_gradient, activation in zip(
            hidden_activation_gradients, before.hidden, strict=True
        )
    ]
    hidden_weight_gradients = [
        [delta * feature for feature in inputs] for delta in hidden_deltas
    ]

    # All gradients must be computed from the old parameters before any update.
    for row_index, row in enumerate(model.hidden_weights):
        for column_index in range(len(row)):
            row[column_index] -= (
                learning_rate * hidden_weight_gradients[row_index][column_index]
            )
        model.hidden_biases[row_index] -= learning_rate * hidden_deltas[row_index]

    for index in range(len(model.output_weights)):
        model.output_weights[index] -= learning_rate * output_weight_gradients[index]
    model.output_bias -= learning_rate * output_bias_gradient

    after = forward(model, inputs, target)
    return TrainingStep(before=before, after=after)


def main() -> None:
    model = initial_model()
    result = train_step(
        model,
        inputs=[1.0, 2.0],
        target=1.0,
        learning_rate=0.5,
    )

    print("Hidden layers reshape the space; the output layer draws the line.")
    print(f"hidden before: {result.before.hidden}")
    print(f"prediction before: {result.before.prediction:.8f}")
    print(f"loss before: {result.before.loss:.8f}")
    print(f"hidden after: {result.after.hidden}")
    print(f"prediction after: {result.after.prediction:.8f}")
    print(f"loss after: {result.after.loss:.8f}")


if __name__ == "__main__":
    main()
