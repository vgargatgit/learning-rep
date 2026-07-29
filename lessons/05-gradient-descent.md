# Lesson 5 — Gradient descent

Backpropagation computes the gradient. Gradient descent uses it:

```text
θ_new = θ_old - η ∂L/∂θ
```

With `η = 0.1`, the canonical example updates all three parameters. The executable example prints exact values and verifies that one sufficiently small update reduces the loss.

A negative derivative does not mean the parameter is “bad”. It means increasing that parameter locally increases or decreases the loss according to the derivative's sign; subtracting the gradient moves in the locally decreasing direction.
