# Part 1 — Data becomes numbers

## Learning objective

Explain how a real-world example becomes an input vector, distinguish a feature from a feature vector, and identify the target the model is asked to predict.

## 1. Start with one example

An **example** is one item presented to the model: one house, one image, one message, or one sensor reading.

For this lesson, imagine that the model receives one house and must predict whether it needs renovation.

```text
One house
   ↓ describe it numerically
[ floor area, bedrooms, age ]
```

The house is the example. The numbers are how we present that example to the model.

## 2. A feature is one measurable property

A **feature** is one numerical property used to describe an example.

For our house:

```text
x₁ = floor area in square metres
x₂ = number of bedrooms
x₃ = age in years
```

Features may be directly measured, designed by a person, or learned by a neural network. At the input, we often begin with measured or engineered features. Hidden layers can later create learned features.

## 3. A feature vector collects the features

A **feature vector** is the ordered collection of features describing one example.

```text
x = [x₁, x₂, x₃]
  = [120, 3, 18]
```

The order matters. Position 1 means floor area, position 2 means bedrooms, and position 3 means age. Swapping positions changes the meaning of the data.

A single coordinate such as `x₂` is a feature. The complete vector `x` is the input representation of this house.

## 4. Input and target play different roles

The **input** is the information supplied to the model. The **target** is the value we want the model to learn to predict.

```text
input x  = [120, 3, 18]
target y = 1
```

Here `y = 1` means “needs renovation” and `y = 0` means “does not need renovation”. The target is used during training to judge the prediction; it is not another input feature.

## 5. The first representation is the input vector

A **representation** is a numerical encoding of an example at a particular stage of a model.

The raw input vector is already a representation:

```text
house → x = [120, 3, 18]
```

A hidden layer will later transform it into another representation:

```text
input representation x → hidden representation h
```

The central question of the paper is how training can shape that hidden representation so it becomes useful for the prediction task.

## Plain Python

```python
feature_names = ["floor_area_m2", "bedrooms", "age_years"]
x = [120.0, 3.0, 18.0]
y = 1.0

for name, value in zip(feature_names, x):
    print(f"{name}: {value}")

print("input feature vector:", x)
print("training target:", y)
```

Python lists make the idea visible, but numerical libraries represent examples as tensors so operations can be applied efficiently to many examples.

## The same data in PyTorch

```python
import torch

x = torch.tensor([120.0, 3.0, 18.0])
y = torch.tensor(1.0)

print("input shape:", x.shape)   # torch.Size([3])
print("input:", x)
print("target:", y)
```

The tensor `x` has three coordinates, so this example currently lives in a three-dimensional input feature space.

## Keep these distinctions clear

- **Example:** the real item being modelled.
- **Feature:** one numerical property of that example.
- **Feature vector:** the ordered collection of its features.
- **Input:** the feature vector supplied to the model.
- **Target:** the value the model should learn to predict.
- **Representation:** the complete numerical encoding at one stage of the model.

## Misconception check

> A feature vector is not the physical object itself. It is a chosen numerical description of that object. Different choices of features produce different representations of the same example.
