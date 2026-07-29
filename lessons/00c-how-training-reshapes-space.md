# Part 3 — How training reshapes the space

## Learning objective

Explain a complete **binary classification** training step: how every neuron in a dense layer receives the full previous representation, how the layer creates a new representation whose dimension equals its number of neurons, and how one classification error updates both the hidden transformation and the output decision line.

## 1. This is classification, not regression

The task has two classes:

```text
y = 0    class 0
y = 1    class 1
```

The network produces one output **logit** `s`. Sigmoid converts it into the predicted probability of class 1:

```text
p = sigmoid(s)
```

A threshold such as `p ≥ 0.5` converts the probability into a predicted class. Training uses **binary cross-entropy**, not squared-error regression loss:

```text
L = -[y log(p) + (1-y) log(1-p)]
```

Everything in this part is therefore a deep-learning classification example.

## 2. The dense-layer connectivity and dimension rule

Suppose the previous layer supplies an `n`-dimensional representation:

```text
a_previous = [a₁, a₂, ..., aₙ]
```

A dense layer with `m` neurons obeys two rules:

1. **Every neuron receives all `n` coordinates of the previous representation.**
2. **The layer emits `m` activations, so its output representation is `m`-dimensional.**

```text
previous representation: n coordinates
             ↓ every coordinate enters every neuron
dense layer:             m neurons
             ↓ one activation per neuron
output representation:   m coordinates
```

In matrix notation:

```text
W has shape (m, n)
b has shape (m,)
z = W a_previous + b
h = activation(z)
h has shape (m,)
```

Each row of `W` belongs to one neuron. Because that row has `n` weights, that neuron can combine all `n` coordinates from the previous representation.

For our `2 → 2 → 1` classifier:

```text
input x                  has 2 coordinates
hidden layer             has 2 neurons
hidden representation h has 2 coordinates
output layer             has 1 neuron
output logit s           has 1 coordinate
```

More concretely:

```text
h₁ receives x₁ and x₂
h₂ receives x₁ and x₂

s receives h₁ and h₂
```

This rule applies to every dense hidden layer, regardless of depth.

## 3. Hidden layers reshape; the output layer draws the line

Part 2 produced a hidden representation:

```text
h = [h₁, h₂]
```

The binary output unit receives **all of `h`** and computes:

```text
s = v₁h₁ + v₂h₂ + c
p = sigmoid(s)
```

The equation

```text
v₁h₁ + v₂h₂ + c = 0
```

defines a straight decision line in the two-dimensional hidden space.

This gives us the running motif:

```text
hidden layers reshape the space
output layer draws the line
```

The output classifier can remain geometrically simple because hidden layers can move examples into more useful coordinates.

## 4. Start with one example and one imperfect classification

Use the same dense hidden layer as Part 2:

```text
x = [1, 2]

W = [[ 0.50, -0.25],
     [ 0.25,  0.50]]

b = [0.10, -0.20]
```

Both rows of `W` contain two weights, so both hidden neurons receive both input features.

The hidden representation is:

```text
h ≈ [0.52497919, 0.74077490]
```

Now give the output unit these parameters:

```text
v = [0.80, -0.60]
c = 0.05
```

For target class `y = 1`:

```text
s = 0.80h₁ - 0.60h₂ + 0.05
  ≈ 0.02551841

p = sigmoid(s)
  ≈ 0.50637926
```

The classifier is only slightly more confident in class 1 than class 0. Using binary cross-entropy:

```text
L ≈ 0.68046937
```

## 5. The classification error becomes the first gradient signal

For sigmoid plus binary cross-entropy:

```text
∂L/∂s = p - y
```

For this example:

```text
∂L/∂s ≈ -0.49362074
```

The output-layer gradients are:

```text
∂L/∂v₁ = (p - y)h₁
∂L/∂v₂ = (p - y)h₂
∂L/∂c  = p - y
```

Changing `v₁`, `v₂`, and `c` changes the position and orientation of the classification line.

## 6. Backpropagation sends responsibility into the hidden layer

The output neuron received the complete hidden representation:

```text
s = v₁h₁ + v₂h₂ + c
```

Therefore the error signal reaches every hidden coordinate:

```text
∂L/∂h₁ = (p - y)v₁
∂L/∂h₂ = (p - y)v₂
```

Each hidden activation depends on its pre-activation:

```text
hᵢ = sigmoid(zᵢ)
∂L/∂zᵢ = (∂L/∂hᵢ) hᵢ(1 - hᵢ)
```

Finally, hidden neuron `i` received every input coordinate `xⱼ`:

```text
∂L/∂Wᵢⱼ = (∂L/∂zᵢ)xⱼ
∂L/∂bᵢ  = ∂L/∂zᵢ
```

The final classification mistake now produces a gradient for every dense connection that helped construct the hidden representation.

## 7. One gradient step changes two things at once

Using learning rate `η = 0.5`, update every parameter:

```text
parameter_new = parameter_old - η × gradient
```

After one step:

```text
h_before ≈ [0.52497919, 0.74077490]
h_after  ≈ [0.59758996, 0.70669378]
```

The output parameters also change, so the decision line moves:

```text
v_before = [ 0.80000000, -0.60000000]
c_before = 0.05000000

v_after  ≈ [ 0.92957031, -0.41716907]
c_after  ≈ 0.29681037
```

The new probability and classification loss are:

```text
p_after ≈ 0.63587423
L_after ≈ 0.45275449
```

The loss decreased from approximately `0.68047` to `0.45275`. The hidden point moved, and the output line moved. Both changes cooperated to make class 1 easier to predict.

## 8. Backpropagation and gradient descent have different jobs

- **Backpropagation** computes how the classification loss changes with respect to every parameter.
- **Gradient descent** uses those gradients to change the parameters.

```text
FORWARD
input → hidden representation → line → class probability → BCE loss

BACKWARD
loss → output gradients → hidden gradients → every dense connection

UPDATE
reshape the hidden space + redraw the classification line
```

## 9. Why repeated examples are necessary

One update for one example only makes that example easier to classify. A useful representation must work across many labelled examples.

```text
labelled example → probability → BCE loss → gradients → update
                              repeat across the dataset
```

The shared dense-layer weights must eventually place many examples so the output line separates the two classes well.

## 10. PyTorch makes the dimensions visible

```python
self.hidden = nn.Linear(in_features=2, out_features=2)
self.output = nn.Linear(in_features=2, out_features=1)
```

Interpretation:

```text
hidden layer:
    each of 2 neurons receives all 2 input coordinates
    output representation dimension = 2

output layer:
    its 1 neuron receives all 2 hidden coordinates
    output logit dimension = 1
```

Training uses:

```python
loss_function = nn.BCEWithLogitsLoss()

optimizer.zero_grad()
logit, hidden = model(inputs)
loss = loss_function(logit, target)
loss.backward()
optimizer.step()
```

`BCEWithLogitsLoss` confirms that this is binary classification and combines the output sigmoid calculation with binary cross-entropy in a numerically stable form.

## Final dimension rule

> For a dense layer, every neuron receives the entire previous representation. If the layer contains `m` neurons, it emits `m` activations, so the new representation has dimension `m`.

## Misconception checks

> The number of weights entering one dense neuron equals the dimension of the previous representation—not the number of neurons in its own layer.

> The output representation dimension equals the number of neurons in the current layer, not necessarily the previous layer's dimension.

> The output line is not the learned representation. It is a binary classifier operating on the learned representation.

> A lower classification loss after one example does not prove that the representation is good for the whole dataset.
