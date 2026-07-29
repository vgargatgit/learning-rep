# Learning path

## Part I — The problem backpropagation solves

1. **Why hidden units create a credit-assignment problem**
2. **The forward pass as a composition of functions**
3. **A scalar loss as the training objective**

## Part II — The mechanism

4. **Local derivatives and the chain rule**
5. **Error signals at output units**
6. **Error signals at hidden units**
7. **Weight and bias gradients**
8. **Gradient descent updates**

## Part III — Learning representations

9. **Why hidden-unit activations are representations**
10. **How repeated updates shape useful intermediate features**
11. **What the 1986 paper demonstrated**

## Part IV — From the paper to modern systems

12. **Reverse-mode automatic differentiation**
13. **Vectorised backpropagation**
14. **Mini-batches, modern losses, and modern activations**
15. **Gradient checking and debugging**

## Planned visual progression

| Scene | Core visual | Mathematical anchor |
|---|---|---|
| 1 | Cast and network map | `z = Σwᵢxᵢ + b` |
| 2 | Inputs travelling forward | `ŷ = σ(z)` |
| 3 | Loss comparing target and prediction | `L = ½(ŷ-y)²` |
| 4 | Gradient Messenger following dependencies | chain rule |
| 5 | Parameter update workshop | `θ ← θ - η∇θL` |
| 6 | Hidden units forming useful features | learned representation |
