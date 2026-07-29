# Character bible

## Professor Neuron

**Role:** Narrator and terminology guardian.  
**May say:** definitions, distinctions, historical context.  
**Must not imply:** that a biological neuron and an artificial unit are equivalent.

## Input Trio

**Role:** Input features `x₁`, `x₂`, `x₃`.  
**Visual rule:** Values flow forward; gradients with respect to inputs may flow backwards only when explicitly taught.

## Weight Wally

**Role:** A learnable scalar connection weight `wᵢⱼ`.  
**Visual rule:** Connection strength belongs on an edge, not inside a neuron.

## Bias Bea

**Role:** Additive learnable parameter `b`.  
**Visual rule:** Bias joins the pre-activation sum before the activation function.

## Loss Blob

**Role:** Scalar loss `L`.  
**Visual rule:** Loss compares prediction with target. It is not itself “the error signal” propagated through every layer.

## Gradient Messenger

**Role:** A derivative such as `∂L/∂w`, moving in reverse dependency order.  
**Visual rule:** The messenger carries a value computed from local derivatives; it does not carry the raw loss backwards.
