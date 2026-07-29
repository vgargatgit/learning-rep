"""Tests for the canonical backpropagation example."""

from __future__ import annotations

import importlib.util
import pathlib
import sys
import unittest


MODULE_PATH = pathlib.Path(__file__).parents[1] / "examples" / "toy_backprop.py"
SPEC = importlib.util.spec_from_file_location("toy_backprop", MODULE_PATH)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class ToyBackpropTest(unittest.TestCase):
    def setUp(self) -> None:
        self.inputs = (1.0, 2.0)
        self.weights = (0.3, 0.7)
        self.bias = 0.5
        self.target = 1.0

    def test_forward_values(self) -> None:
        result = MODULE.forward(self.inputs, self.weights, self.bias, self.target)
        self.assertAlmostEqual(result.z, 2.2, places=12)
        self.assertAlmostEqual(result.prediction, 0.9002495108803148, places=12)
        self.assertAlmostEqual(result.loss, 0.004975080039808218, places=12)

    def test_analytical_gradient_matches_finite_difference(self) -> None:
        result = MODULE.forward(self.inputs, self.weights, self.bias, self.target)
        gradients = MODULE.backward(self.inputs, result.prediction, self.target)
        epsilon = 1e-6

        for index, analytical in enumerate(gradients.weights):
            plus = list(self.weights)
            minus = list(self.weights)
            plus[index] += epsilon
            minus[index] -= epsilon
            numerical = (
                MODULE.forward(self.inputs, plus, self.bias, self.target).loss
                - MODULE.forward(self.inputs, minus, self.bias, self.target).loss
            ) / (2.0 * epsilon)
            self.assertAlmostEqual(analytical, numerical, places=8)

        numerical_bias = (
            MODULE.forward(self.inputs, self.weights, self.bias + epsilon, self.target).loss
            - MODULE.forward(self.inputs, self.weights, self.bias - epsilon, self.target).loss
        ) / (2.0 * epsilon)
        self.assertAlmostEqual(gradients.bias, numerical_bias, places=8)

    def test_gradient_descent_step_reduces_loss(self) -> None:
        before = MODULE.forward(self.inputs, self.weights, self.bias, self.target)
        gradients = MODULE.backward(self.inputs, before.prediction, self.target)
        new_weights, new_bias = MODULE.update(
            self.weights, self.bias, gradients, learning_rate=0.1
        )
        after = MODULE.forward(self.inputs, new_weights, new_bias, self.target)
        self.assertLess(after.loss, before.loss)


if __name__ == "__main__":
    unittest.main()
