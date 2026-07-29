# Paper map

This document will map the original paper section-by-section into the illustrated learning sequence.

## Central claims to preserve

- A multilayer network can learn internal representations by adjusting weights to reduce output error.
- The derivative of the error with respect to each weight can be computed efficiently by propagating error derivatives backwards.
- Hidden units receive a useful learning signal even though targets are supplied only at the output.
- Repeated examples and updates cause hidden units to develop representations useful for the task.

## Historical-language note

The paper uses terminology and notation that differ from many current textbooks. Lessons should show the paper's language first, then give the corresponding modern term where useful. Do not silently rewrite history using only modern notation.

## Reading workflow

For each passage:

1. quote only a short, necessary phrase;
2. paraphrase the claim;
3. draw the computation or dependency;
4. construct the smallest useful numerical example;
5. connect the claim to the canonical implementation;
6. identify what remains true in modern systems.
