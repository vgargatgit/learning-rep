# Learning Representations by Back-Propagating Errors

An illustrated, calculation-first learning companion to the 1986 paper by David E. Rumelhart, Geoffrey E. Hinton, and Ronald J. Williams.

## Website

The public GitHub Pages site is deployed at:

`https://vgargatgit.github.io/learning-rep/`

The reader includes six cartoon-led lessons, the canonical toy calculation, lesson progress, and an interactive backpropagation lab.

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
