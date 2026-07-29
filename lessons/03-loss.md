# Lesson 3 — Binary classification loss

Let the target class be `y = 1` and the predicted probability of class 1 be:

```text
p ≈ 0.90024951
```

This project stays on **binary classification**, so we use binary cross-entropy:

```text
L = -[y log(p) + (1-y) log(1-p)]
```

For `y = 1`:

```text
L = -log(p)
  ≈ 0.10508332
```

A probability closer to the correct class gives a smaller loss. A confidently wrong probability gives a large loss.

Keep these quantities separate:

- **Target `y`:** the correct class label, either `0` or `1`.
- **Logit `z`:** the unrestricted score before sigmoid.
- **Probability `p = sigmoid(z)`:** predicted probability of class 1.
- **Predicted class:** commonly `1` when `p ≥ 0.5`, otherwise `0`.
- **Loss `L`:** the scalar binary cross-entropy used for training.

For sigmoid followed by binary cross-entropy, the derivative with respect to the logit simplifies to:

```text
∂L/∂z = p - y
```

This compact classification gradient is the signal backpropagated into earlier layers.
