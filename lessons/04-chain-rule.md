# Lesson 4 — Classification gradients and the chain rule

For binary classification, the dependency path is:

```text
weight → logit → probability → loss
```

The forward equations are:

```text
z = sum(w_i x_i) + b
p = sigmoid(z)
L = binary cross-entropy(p, y)
```

Applying the chain rule to one weight gives:

```text
dL/dw_i = (dL/dp)(dp/dz)(dz/dw_i)
```

For sigmoid followed by binary cross-entropy, the probability and sigmoid derivatives simplify to one compact output signal:

```text
dL/dz = p - y
```

Therefore:

```text
dL/dw_i = (p - y)x_i
dL/db = p - y
```

For a dense layer, every neuron receives the complete previous representation. If the previous representation has `n` coordinates and the current layer has `m` neurons:

```text
weight matrix shape = (m, n)
layer output shape = (m,)
```

Backpropagation computes a gradient for every dense connection. Modern frameworks perform the same reverse-mode automatic differentiation while reusing values stored during the forward pass.
