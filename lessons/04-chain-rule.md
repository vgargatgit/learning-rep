# Lesson 4 — Backpropagation and the chain rule

The loss depends on the prediction, the prediction depends on `z`, and `z` depends on each parameter.

```text
wᵢ → z → ŷ → L
```

Therefore:

```text
∂L/∂wᵢ = (∂L/∂ŷ)(∂ŷ/∂z)(∂z/∂wᵢ)
```

For the canonical example:

```text
∂L/∂ŷ = ŷ - y
∂ŷ/∂z = ŷ(1 - ŷ)
∂z/∂w₁ = x₁
∂z/∂w₂ = x₂
∂z/∂b = 1
```

Backpropagation stores or reuses forward-pass intermediates and combines local derivatives in reverse order. In modern terminology, this is reverse-mode automatic differentiation specialised to a computation graph.
