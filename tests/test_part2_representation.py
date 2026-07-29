"""Tests for the Part 2 hidden-representation example."""

from __future__ import annotations

import importlib.util
import math
from pathlib import Path
import unittest


MODULE_PATH = Path(__file__).parents[1] / "examples" / "part2_hidden_representation.py"
SPEC = importlib.util.spec_from_file_location("part2_hidden_representation", MODULE_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError(f"could not load {MODULE_PATH}")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class HiddenRepresentationTests(unittest.TestCase):
    def test_canonical_hidden_values(self) -> None:
        pre_activations, hidden = MODULE.hidden_representation(
            (1.0, 2.0),
            ((0.50, -0.25), (0.25, 0.50)),
            (0.10, -0.20),
        )

        self.assertAlmostEqual(pre_activations[0], 0.10)
        self.assertAlmostEqual(pre_activations[1], 1.05)
        self.assertAlmostEqual(hidden[0], 1.0 / (1.0 + math.exp(-0.10)))
        self.assertAlmostEqual(hidden[1], 1.0 / (1.0 + math.exp(-1.05)))

    def test_rejects_wrong_weight_width(self) -> None:
        with self.assertRaises(ValueError):
            MODULE.hidden_representation(
                (1.0, 2.0),
                ((0.50,),),
                (0.10,),
            )


if __name__ == "__main__":
    unittest.main()
