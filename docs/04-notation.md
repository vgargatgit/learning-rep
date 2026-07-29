# Canonical notation

| Symbol | Meaning |
|---|---|
| `xᵢ` | input feature |
| `wᵢ` | learnable weight |
| `b` | learnable bias |
| `z` | pre-activation or classification logit |
| `a` | activation of a unit |
| `p` | predicted probability of class 1 |
| `ŷ` | predicted class |
| `y` | binary target class, `0` or `1` |
| `L` | binary cross-entropy loss |
| `η` | learning rate |
| `∂L/∂θ` | gradient component for parameter `θ` |

## Canonical binary-classification neuron

```text
z = w₁x₁ + w₂x₂ + b
p = σ(z)
L = -[y log(p) + (1-y) log(1-p)]
```

For sigmoid plus binary cross-entropy:

```text
∂L/∂z = p - y
∂z/∂wᵢ = xᵢ
∂z/∂b = 1
```

```text
∂L/∂wᵢ = (p - y)xᵢ
∂L/∂b  = p - y
```

## Dense-layer dimension rule

If the previous representation has dimension `n` and a dense layer has `m` neurons:

```text
W has shape (m, n)
b has shape (m,)
output representation has shape (m,)
```

Every neuron receives all `n` coordinates. Each neuron emits one activation, so `m` neurons produce an `m`-dimensional representation.

## Terminology rules

- Use **pre-activation** or **logit** for `z` when it is the binary classifier score.
- Use **activation** for the output of an activation function.
- Use **probability** for the sigmoid output `p`.
- Use **predicted class** only after applying a decision threshold.
- Use **binary cross-entropy** for the canonical classification loss.
- Use **gradient** for derivatives of a scalar loss with respect to parameters.
- Use **backpropagation** for efficient gradient computation, not for the parameter update itself.
- Use **gradient descent** for the optimisation update.
