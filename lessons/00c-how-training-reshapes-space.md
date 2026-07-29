# Part 3 — How training reshapes the space

## Learning objective

Explain how a prediction error produces gradients for both the output layer and the hidden layer, and how one gradient-descent step changes both the decision line and the hidden representation.

## 1. Hidden layers reshape; the output layer draws the line

Part 2 produced a hidden representation:

```text
h = [h₁, h₂]
```

A binary output unit can make a prediction from that representation using a weighted sum:

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

The output unit can stay geometrically simple because the hidden layer is allowed to move examples into more useful coordinates.

## 2. Start with one example and one imperfect prediction

Use the same hidden layer as Part 2:

```text
x = [1, 2]

W = [[ 0.50, -0.25],
     [ 0.25,  0.50]]

b = [0.10, -0.20]
```

The hidden representation is:

```text
h ≈ [0.52497919, 0.74077490]
```

Now give the output unit these parameters:

```text
v = [0.80, -0.60]
c = 0.05
```

For target `y = 1`:

```text
s = 0.80h₁ - 0.60h₂ + 0.05
  ≈ 0.02551841

p = sigmoid(s)
  ≈ 0.50637926
```

The model is only slightly more confident in class 1 than class 0. Using binary cross-entropy:

```text
L ≈ 0.68046937
```

## 3. The output error becomes the first gradient signal

For sigmoid plus binary cross-entropy, the derivative with respect to the output logit is:

```text
∂L/∂s = p - y
```

For this example:

```text
∂L/∂s ≈ -0.49362074
```

This sign says that increasing `s` would locally reduce the loss for target class 1.

The output-layer gradients are:

```text
∂L/∂v₁ = (p - y)h₁
∂L/∂v₂ = (p - y)h₂
∂L/∂c  = p - y
```

Changing `v₁`, `v₂`, and `c` changes the position and orientation of the decision line.

## 4. Backpropagation sends responsibility into the hidden layer

The output logit depends on both hidden coordinates:

```text
s = v₁h₁ + v₂h₂ + c
```

Therefore:

```text
∂L/∂h₁ = (p - y)v₁
∂L/∂h₂ = (p - y)v₂
```

The hidden activations depend on their pre-activations:

```text
hᵢ = sigmoid(zᵢ)
```

So:

```text
∂L/∂zᵢ = (∂L/∂hᵢ) hᵢ(1 - hᵢ)
```

Finally, each hidden pre-activation depends on its weights and bias:

```text
∂L/∂Wᵢⱼ = (∂L/∂zᵢ)xⱼ
∂L/∂bᵢ  = ∂L/∂zᵢ
```

This is the credit-assignment step. The final mistake has now produced a specific gradient for every parameter that helped create the hidden coordinates.

## 5. One gradient step changes two things at once

Using learning rate `η = 0.5`, update every parameter:

```text
parameter_new = parameter_old - η × gradient
```

After one step, the hidden representation becomes:

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

The new prediction and loss are:

```text
p_after ≈ 0.63587423
L_after ≈ 0.45275449
```

The loss decreased from approximately `0.68047` to `0.45275`.

The hidden point moved, and the output line moved. Both changes cooperated to make the target easier to classify.

## 6. Backpropagation and gradient descent have different jobs

Keep these two operations separate:

- **Backpropagation** computes how the loss changes with respect to every parameter.
- **Gradient descent** uses those gradients to change the parameters.

Backpropagation answers:

```text
Which direction would increase the loss?
```

Gradient descent responds:

```text
Move a small step in the opposite direction.
```

## 7. Why repeated examples are necessary

One update for one example only makes that example easier to classify. A useful representation must work across many examples.

During training, examples repeatedly exert pressure on the same parameters:

```text
example → prediction → loss → gradients → update
                    repeat across the dataset
```

Over many updates, the hidden transformation is shaped so examples relevant to the task become easier for the output layer to separate.

A single example can pull the line and its hidden point in a useful local direction. The dataset determines whether the overall representation becomes broadly useful.

## 8. Plain Python: one complete training step

```python
from part3_training_step import initial_model, train_step

model = initial_model()
result = train_step(model, inputs=[1.0, 2.0], target=1.0, learning_rate=0.5)

print("hidden before:", result.before.hidden)
print("loss before:", result.before.loss)
print("hidden after:", result.after.hidden)
print("loss after:", result.after.loss)
```

The implementation calculates each local derivative explicitly, so every number can be traced to the chain rule.

## 9. PyTorch: autograd computes the same gradients

```python
optimizer.zero_grad()
logit, hidden = model(inputs)
loss = loss_function(logit, target)
loss.backward()
optimizer.step()
```

The sequence maps directly onto the conceptual story:

- `model(inputs)` creates the hidden representation and prediction.
- `loss_function(...)` measures the mistake.
- `loss.backward()` performs backpropagation.
- `optimizer.step()` performs the parameter update.

## The running motif

```text
FORWARD
input → hidden representation → line → prediction → loss

BACKWARD
input ← hidden gradients      ← output gradient ← loss

UPDATE
reshape the hidden space + redraw the line
```

## Misconception checks

> The hidden point does not move independently. It moves because gradient descent changes the hidden-layer weights and biases that compute its coordinates.

> The output line is not the learned representation. The line is a classifier operating on the learned representation.

> A lower loss after one example does not prove that the representation is good for the whole dataset. General usefulness emerges from training across many examples.
