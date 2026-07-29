# Part 2 — Networks transform representations

## Learning objective

Explain how a neuron combines input features, how several hidden units produce a new feature vector, and why that hidden representation can make a prediction task easier for the next layer.

## 1. The input vector is already a representation

From Part 1, one example is encoded as an input feature vector:

```text
x = [x₁, x₂]
```

This vector is the example's **input representation**. Its coordinates are the input features.

A neural network does not start with an object such as a house or image directly. It starts with a numerical representation and transforms it into another numerical representation.

```text
input representation x → hidden representation h → prediction
```

## 2. One neuron combines all of its input features

A neuron first computes a weighted sum plus a bias:

```text
z = w₁x₁ + w₂x₂ + b
```

The quantity `z` is the **pre-activation**. An activation function then produces the neuron's activation:

```text
h = σ(z)
```

For a hidden unit, that activation is one hidden feature of the input. When its weights have been learned from data, it is a learned feature. The weights decide which mixture of input features the unit responds to.

For the first hidden unit in our toy layer:

```text
z₁ = 0.50x₁ - 0.25x₂ + 0.10
h₁ = σ(z₁)
```

With `x = [1, 2]`:

```text
z₁ = 0.50(1) - 0.25(2) + 0.10 = 0.10
h₁ = σ(0.10) ≈ 0.52497919
```

## 3. A hidden layer creates a vector of learned features

Now add a second hidden unit:

```text
z₂ = 0.25x₁ + 0.50x₂ - 0.20
h₂ = σ(z₂)
```

For the same input `x = [1, 2]`:

```text
z₂ = 0.25(1) + 0.50(2) - 0.20 = 1.05
h₂ = σ(1.05) ≈ 0.74077490
```

The two activations form the hidden representation:

```text
h = [h₁, h₂]
  ≈ [0.52497919, 0.74077490]
```

Keep the terminology precise:

- `h₁` is one hidden feature or hidden activation.
- `h₂` is another hidden feature or hidden activation.
- `h = [h₁, h₂]` is the complete hidden representation.
- The hidden layer is the transformation that produces `h` from `x`.

## 4. Matrix notation says the same thing compactly

For several hidden units, the separate equations can be written as:

```text
z = Wx + b
h = σ(z)
```

In this example:

```text
x has shape (2,)
W has shape (2, 2)
b has shape (2,)
h has shape (2,)
```

Each row of `W` contains the weights for one hidden unit. Each hidden unit sees the full input vector but learns a different weighted combination.

## 5. A representation defines a feature space

A **feature space** is the coordinate system in which examples are represented.

- In the input feature space, an example is located by `x₁` and `x₂`.
- In the hidden feature space, the same example is located by `h₁` and `h₂`.

The physical example has not changed. Its coordinates have changed.

```text
same example
    x = [x₁, x₂]       in input space
    h = [h₁, h₂]       in hidden space
```

This is the central visual idea of representation learning: the network can redraw the data in a new coordinate system.

## 6. Why can a new representation help?

A representation is useful when it makes the required prediction easier for later layers.

Imagine two classes that are tangled in the input feature space. A straight boundary may not separate them. A nonlinear hidden layer can move the examples to new coordinates where a simple output layer can separate the classes.

The hidden layer does not know in advance that it should create a human-readable concept such as “old building” or “diagonal edge”. Training changes its weights because some hidden representations lead to lower task loss.

Usefulness is therefore **task-relative**:

- A representation useful for predicting renovation may be poor for predicting sale price.
- A representation useful for recognising digits may be poor for recognising faces.
- A hidden feature may be useful even when it has no simple human-language label.

## 7. Plain Python: compute the hidden representation

```python
from math import exp


def sigmoid(value: float) -> float:
    return 1.0 / (1.0 + exp(-value))


x = [1.0, 2.0]
weights = [
    [0.50, -0.25],
    [0.25, 0.50],
]
biases = [0.10, -0.20]

hidden = []
for row, bias in zip(weights, biases):
    z = sum(weight * feature for weight, feature in zip(row, x)) + bias
    hidden.append(sigmoid(z))

print("input representation x:", x)
print("hidden representation h:", hidden)
```

The loop performs the same calculation once for each hidden unit.

## 8. PyTorch: `nn.Linear` performs `Wx + b`

```python
import torch
from torch import nn

x = torch.tensor([1.0, 2.0])
hidden_layer = nn.Linear(2, 2)

with torch.no_grad():
    hidden_layer.weight.copy_(torch.tensor([
        [0.50, -0.25],
        [0.25, 0.50],
    ]))
    hidden_layer.bias.copy_(torch.tensor([0.10, -0.20]))

z = hidden_layer(x)
h = torch.sigmoid(z)

print("pre-activations z:", z)
print("hidden representation h:", h)
```

`nn.Linear(2, 2)` means two input features and two output features. Here those output features are the two coordinates of the hidden representation.

## Keep these distinctions clear

- **Input feature:** one coordinate of `x`.
- **Input representation:** the complete vector `x`.
- **Hidden unit:** one neuron inside a hidden layer.
- **Hidden activation:** one coordinate such as `h₁`.
- **Hidden representation:** the complete vector `h`.
- **Representation transformation:** the mapping `x → h`.
- **Representation learning:** training the parameters of that mapping so `h` becomes useful for the task.

## Misconception checks

> A hidden layer does not merely rename the input coordinates. Its weights, biases, and nonlinear activation compute new coordinates.

> Computing `h = σ(Wx + b)` is a forward transformation. The representation becomes learned only because training later changes `W` and `b` using gradients.
