# Learning Representations by Back-Propagating Errors

An illustrated, calculation-first learning companion to the 1986 paper by David E. Rumelhart, Geoffrey E. Hinton, and Ronald J. Williams.

## Website

The public GitHub Pages site is deployed at:

`https://vgargatgit.github.io/learning-rep/`

The reader now begins with:

- **Part 1: Data becomes numbers** — examples, features, feature vectors, inputs, targets, and the first definition of a representation.
- **Part 2: Networks transform representations** — neuron computation, hidden units, hidden activation vectors, feature spaces, and why a useful hidden representation can simplify prediction.

It then continues through six cartoon-led backpropagation lessons, an interactive representation explorer, and an interactive gradient lab.

## Runnable Part 1 examples

Plain Python:

```bash
python3 examples/part1_features.py
```

PyTorch:

```bash
python3 examples/part1_features_torch.py
```

The two examples deliberately represent the same house, feature vector, and target so readers can see how a Python list maps to a PyTorch tensor.

## Runnable Part 2 examples

Plain Python:

```bash
python3 examples/part2_hidden_representation.py
```

PyTorch:

```bash
python3 examples/part2_hidden_representation_torch.py
```

Both implementations use the same two-input, two-unit sigmoid hidden layer and produce the same hidden representation.

## Access gate

The website uses a client-side credential gate. The submitted username and password are processed using browser-native PBKDF2-HMAC-SHA-256 with a random salt and 1,200,000 iterations. The result is compared with committed verifier bytes; the literal password is not stored in the website source.

Because this is a **public repository and static GitHub Pages site**, the gate is an access prompt rather than true confidentiality. The lesson Markdown and illustrations are visible to anyone who browses the repository. Strong server-side access control requires a server or identity-aware proxy.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Tests

```bash
python3 -m unittest discover -s tests -v
```

## Copyright

This repository is an original educational companion. It does not include or reproduce the paper PDF.
