"""The Part 3 training step expressed with PyTorch autograd."""

from __future__ import annotations

import torch
from torch import nn


class TinyRepresentationClassifier(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.hidden = nn.Linear(2, 2)
        self.output = nn.Linear(2, 1)

        with torch.no_grad():
            self.hidden.weight.copy_(
                torch.tensor([[0.50, -0.25], [0.25, 0.50]])
            )
            self.hidden.bias.copy_(torch.tensor([0.10, -0.20]))
            self.output.weight.copy_(torch.tensor([[0.80, -0.60]]))
            self.output.bias.copy_(torch.tensor([0.05]))

    def forward(self, inputs: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        hidden_representation = torch.sigmoid(self.hidden(inputs))
        logit = self.output(hidden_representation).squeeze(-1)
        return logit, hidden_representation


def main() -> None:
    inputs = torch.tensor([1.0, 2.0])
    target = torch.tensor(1.0)
    model = TinyRepresentationClassifier()
    loss_function = nn.BCEWithLogitsLoss()
    optimizer = torch.optim.SGD(model.parameters(), lr=0.5)

    with torch.no_grad():
        before_logit, before_hidden = model(inputs)
        before_loss = loss_function(before_logit, target)
        before_prediction = torch.sigmoid(before_logit)

    optimizer.zero_grad()
    logit, _ = model(inputs)
    loss = loss_function(logit, target)
    loss.backward()
    optimizer.step()

    with torch.no_grad():
        after_logit, after_hidden = model(inputs)
        after_loss = loss_function(after_logit, target)
        after_prediction = torch.sigmoid(after_logit)

    print("Hidden layers reshape the space; the output layer draws the line.")
    print("hidden before:", before_hidden)
    print("prediction before:", before_prediction.item())
    print("loss before:", before_loss.item())
    print("hidden after:", after_hidden)
    print("prediction after:", after_prediction.item())
    print("loss after:", after_loss.item())


if __name__ == "__main__":
    main()
