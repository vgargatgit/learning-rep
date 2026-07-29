"""A dense 2 -> 2 -> 1 binary classifier using PyTorch autograd."""

from __future__ import annotations

import torch
from torch import nn


class TinyRepresentationClassifier(nn.Module):
    def __init__(self) -> None:
        super().__init__()

        # Dense rule: each of 2 hidden neurons receives both input coordinates.
        # Therefore the hidden representation has dimension 2.
        self.hidden = nn.Linear(in_features=2, out_features=2)

        # The single binary-classification output neuron receives all 2 hidden
        # coordinates and emits one logit.
        self.output = nn.Linear(in_features=2, out_features=1)

        with torch.no_grad():
            self.hidden.weight.copy_(
                torch.tensor([[0.50, -0.25], [0.25, 0.50]])
            )
            self.hidden.bias.copy_(torch.tensor([0.10, -0.20]))
            self.output.weight.copy_(torch.tensor([[0.80, -0.60]]))
            self.output.bias.copy_(torch.tensor([0.05]))

    def forward(self, inputs: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        hidden_representation = torch.sigmoid(self.hidden(inputs))
        assert hidden_representation.shape[-1] == self.hidden.out_features

        logit = self.output(hidden_representation).squeeze(-1)
        return logit, hidden_representation


def main() -> None:
    inputs = torch.tensor([1.0, 2.0])
    target = torch.tensor(1.0)
    model = TinyRepresentationClassifier()

    # Binary classification: one logit plus binary cross-entropy.
    loss_function = nn.BCEWithLogitsLoss()
    optimizer = torch.optim.SGD(model.parameters(), lr=0.5)

    with torch.no_grad():
        before_logit, before_hidden = model(inputs)
        before_loss = loss_function(before_logit, target)
        before_probability = torch.sigmoid(before_logit)

    optimizer.zero_grad()
    logit, _ = model(inputs)
    loss = loss_function(logit, target)
    loss.backward()
    optimizer.step()

    with torch.no_grad():
        after_logit, after_hidden = model(inputs)
        after_loss = loss_function(after_logit, target)
        after_probability = torch.sigmoid(after_logit)

    print("Binary classification: hidden layers reshape; output draws the line.")
    print("input dimension:", inputs.shape[-1])
    print("hidden neurons / representation dimension:", model.hidden.out_features)
    print("output logits:", model.output.out_features)
    print("hidden before:", before_hidden)
    print("class-1 probability before:", before_probability.item())
    print("BCE loss before:", before_loss.item())
    print("hidden after:", after_hidden)
    print("class-1 probability after:", after_probability.item())
    print("BCE loss after:", after_loss.item())


if __name__ == "__main__":
    main()
