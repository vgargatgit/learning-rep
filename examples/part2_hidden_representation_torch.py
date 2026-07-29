"""Part 2: compute the same hidden representation with PyTorch."""

from __future__ import annotations

import torch
from torch import nn


class TinyHiddenLayer(nn.Module):
    """A two-input, two-unit sigmoid hidden layer."""

    def __init__(self) -> None:
        super().__init__()
        self.linear = nn.Linear(in_features=2, out_features=2)

        with torch.no_grad():
            self.linear.weight.copy_(
                torch.tensor(
                    [
                        [0.50, -0.25],
                        [0.25, 0.50],
                    ],
                    dtype=torch.float32,
                )
            )
            self.linear.bias.copy_(
                torch.tensor([0.10, -0.20], dtype=torch.float32)
            )

    def forward(self, inputs: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        pre_activations = self.linear(inputs)
        hidden = torch.sigmoid(pre_activations)
        return pre_activations, hidden


def main() -> None:
    inputs = torch.tensor([1.0, 2.0], dtype=torch.float32)
    layer = TinyHiddenLayer()

    pre_activations, hidden = layer(inputs)

    print("Input representation x:", inputs)
    print("Pre-activations z:", pre_activations)
    print("Hidden representation h:", hidden)
    print("Hidden representation shape:", hidden.shape)


if __name__ == "__main__":
    main()
