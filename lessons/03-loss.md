# Lesson 3 — Prediction error and loss

Let the target be `y = 1` and the prediction be `ŷ ≈ 0.90024951`.

Using half squared error:

```text
L = ½(ŷ - y)²
  ≈ 0.00497508
```

The residual `ŷ - y`, the scalar loss `L`, and the gradient `∂L/∂ŷ` are related but not interchangeable terms.

For this loss:

```text
∂L/∂ŷ = ŷ - y
```
