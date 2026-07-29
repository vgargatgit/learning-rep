# Image review checklist

Generated illustrations are drafts until all checks pass.

## Mathematical checks

- [ ] Every symbol has one meaning throughout the page.
- [ ] Forward-pass numbers match `examples/toy_backprop.py`.
- [ ] Loss includes the same `½` convention used by the derivative.
- [ ] Sigmoid derivative is evaluated using the unrounded prediction in canonical calculations.
- [ ] Gradient signs are correct.
- [ ] Bias gradient uses `∂z/∂b = 1`.
- [ ] Updated parameters produce the displayed post-update prediction and loss.

## Conceptual checks

- [ ] Solid arrows clearly distinguish forward values from backward gradients.
- [ ] Backpropagation and gradient descent are not conflated.
- [ ] Hidden units are described as learning representations, not predefined detectors unless explicitly marked as an analogy.
- [ ] “Error” is not used ambiguously for loss, residual, and gradient.
- [ ] The example architecture matches the equations on the same page.

## Visual checks

- [ ] Text is readable at normal browser width.
- [ ] No cropped labels, overlapping characters, or malformed symbols.
- [ ] Character roles remain consistent with `03-character-bible.md`.
- [ ] Equations are typeset outside generated imagery in the final web version whenever precision matters.
