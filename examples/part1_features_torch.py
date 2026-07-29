"""The Part 1 feature vector represented as PyTorch tensors."""

from __future__ import annotations

import torch


def main() -> None:
    x = torch.tensor([120.0, 3.0, 18.0], dtype=torch.float32)
    y = torch.tensor(1.0, dtype=torch.float32)

    print("Input tensor x:", x)
    print("Input shape:", x.shape)
    print("Target tensor y:", y)


if __name__ == "__main__":
    main()
