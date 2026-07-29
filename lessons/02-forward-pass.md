# Lesson 2 — Forward pass

For the canonical example:

```text
x₁ = 1, x₂ = 2
w₁ = 0.3, w₂ = 0.7
b = 0.5
```

First compute the pre-activation:

```text
z = w₁x₁ + w₂x₂ + b
  = 0.3(1) + 0.7(2) + 0.5
  = 2.2
```

Then apply the sigmoid:

```text
ŷ = σ(z) = 1 / (1 + e⁻ᶻ) ≈ 0.90024951
```

The forward pass uses the current parameters. No learning or updating has happened yet.
