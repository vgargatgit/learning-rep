"""Numerical checks for the Part 3 representation-learning example."""

from __future__ import annotations

import importlib.util
from pathlib import Path
import sys
import unittest


MODULE_PATH = Path(__file__).parents[1] / "examples" / "part3_training_step.py"
SPEC = importlib.util.spec_from_file_location("part3_training_step", MODULE_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("could not load Part 3 example")
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class Part3TrainingStepTest(unittest.TestCase):
    def test_canonical_forward_values(self) -> None:
        result = MODULE.forward(MODULE.initial_model(), [1.0, 2.0], 1.0)

        self.assertAlmostEqual(result.hidden[0], 0.52497918747894, places=12)
        self.assertAlmostEqual(result.hidden[1], 0.740774899182154, places=12)
        self.assertAlmostEqual(result.prediction, 0.5063792564469412, places=12)
        self.assertAlmostEqual(result.loss, 0.68046937177367, places=12)

    def test_one_step_moves_representation_and_reduces_loss(self) -> None:
        result = MODULE.train_step(
            MODULE.initial_model(),
            inputs=[1.0, 2.0],
            target=1.0,
            learning_rate=0.5,
        )

        self.assertLess(result.after.loss, result.before.loss)
        self.assertGreater(result.after.prediction, result.before.prediction)
        self.assertNotEqual(result.after.hidden, result.before.hidden)
        self.assertAlmostEqual(result.after.hidden[0], 0.5975899559005743, places=12)
        self.assertAlmostEqual(result.after.hidden[1], 0.7066937840624917, places=12)
        self.assertAlmostEqual(result.after.loss, 0.45275448705004323, places=12)


if __name__ == "__main__":
    unittest.main()
