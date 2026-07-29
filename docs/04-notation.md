# Canonical notation

| Symbol | Meaning |
|---|---|
| `xᵢ` | input feature |
| `wᵢ` | learnable weight |
| `b` | learnable bias |
| `z` | pre-activation or net input |
| `a` | activation of a unit |
| `ŷ` | prediction |
| `y` | target |
| `L` | scalar loss |
| `η` | learning rate |
| `∂L/∂θ` | gradient component for parameter `θ` |

## Canonical single-neuron equations

```text
z = w₁x₁ + w₂x₂ + b
ŷ = σ(z)
L = ½(ŷ - y)²
```

```text
∂L/∂ŷ = ŷ - y
∂ŷ/∂z = ŷ(1 - ŷ)
∂z/∂wᵢ = xᵢ
∂z/∂b = 1
```

```text
∂L/∂wᵢ = (∂L/∂ŷ)(∂ŷ/∂z)(∂z/∂wᵢ)
∂L/∂b  = (∂L/∂ŷ)(∂ŷ/∂z)
```

## Terminology rules

- Use **pre-activation** or **net input** for `z`.
- Use **activation** for the output of the activation function.
- Use **prediction** when an activation is interpreted as the model output.
- Use **gradient** for derivatives of a scalar loss with respect to parameters.
- Use **backpropagation** for efficient gradient computation, not for the parameter update itself.
- Use **gradient descent** for the optimisation update.
