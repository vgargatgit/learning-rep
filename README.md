# Learning Representations by Back-Propagating Errors

An illustrated, calculation-first learning companion to:

> David E. Rumelhart, Geoffrey E. Hinton, and Ronald J. Williams,  
> **“Learning representations by back-propagating errors”**, *Nature* 323, 533–536 (1986).  
> DOI: `10.1038/323533a0`

The project explains the paper with recurring cartoon characters, small numerical examples, executable code, and pedagogically correct terminology.

> **Status:** Early learning-project scaffold. The generated illustrations are stored as **drafts** until every label, equation, arrow, and numerical result has passed the review checklist.

## Learning goals

After completing the project, a reader should be able to:

- explain why multilayer networks need a method for assigning responsibility for an output error;
- distinguish a forward pass, loss calculation, backward pass, and parameter update;
- derive gradients using the chain rule and local derivatives;
- explain why backpropagation is an efficient reverse-mode differentiation procedure;
- implement a tiny network and verify its gradients numerically;
- explain what an internal representation is and how hidden units learn one;
- connect the 1986 formulation to modern automatic differentiation and deep learning.

## Project map

```text
.
├── assets/drafts/       Generated visual drafts awaiting technical review
├── docs/                Project charter, notation, pedagogy, and review rules
├── examples/            Executable toy backpropagation calculations
├── lessons/             The learning sequence in short, focused chapters
├── site/                Lightweight illustrated web reader
└── tests/               Numerical and finite-difference checks
```

## Start here

1. Read [`docs/00-project-charter.md`](docs/00-project-charter.md).
2. Follow [`docs/01-learning-path.md`](docs/01-learning-path.md).
3. Run the canonical toy calculation:

```bash
python3 examples/toy_backprop.py
```

4. Run the tests:

```bash
python3 -m unittest discover -s tests -v
```

5. Open [`site/index.html`](site/index.html) in a browser to review the current illustrated sequence.

## Canonical toy example

The first calculation deliberately uses one sigmoid neuron so every derivative fits on one page:

```text
x = [1, 2]
w = [0.3, 0.7]
b = 0.5
y = 1

z    = w₁x₁ + w₂x₂ + b = 2.2
ŷ    = sigmoid(z)        ≈ 0.90024951
L    = ½(ŷ - y)²         ≈ 0.00497508
```

The exact values printed by `examples/toy_backprop.py` are the source of truth for visual and written material.

## Recurring characters

- **Professor Neuron** — explains the formal idea and guards terminology.
- **Input Trio** — supplies input features.
- **Weight Wally** — represents learnable connection weights.
- **Bias Bea** — represents the additive bias parameter.
- **Loss Blob** — turns prediction error into a scalar objective.
- **Gradient Messenger** — carries derivatives backwards through the computation graph.

Characters are memory aids. They never replace the mathematical entities they represent.

## Editorial principles

- Simplify the example, not the terminology.
- Label every quantity by both symbol and role.
- Keep forward values separate from gradients.
- Make the dependency graph visible before applying the chain rule.
- Verify every displayed number from executable code.
- Explain what the original paper established and what later terminology adds.

## Copyright note

This repository is an original educational companion. It does not include or reproduce the paper PDF. Consult the publisher or an authorised source for the original article.

## Publish the prepared repository

The repository is initialised locally with a `main` branch and initial commit. From its root on a machine with GitHub CLI installed:

```bash
./scripts/publish-to-github.sh
```

The script creates `vgargatgit/learning-representations-backprop-errors` as a private GitHub repository and pushes `main`. Change `--private` to `--public` only when the material is ready to publish.
