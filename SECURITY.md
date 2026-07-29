# Security model

## Credential verification

The website never compares the submitted password with a literal password in JavaScript. It derives a 256-bit verifier using salted PBKDF2-HMAC-SHA-256 with 1,200,000 iterations and compares the resulting bytes without an early-exit string comparison.

No literal password is committed in the website files.

## Public-repository limitation

This repository and the GitHub Pages files are public. Client-side authentication cannot provide confidentiality against someone who reads or downloads repository content. The lessons and illustrations are therefore public even though normal website navigation begins with a login screen.

The committed verifier also permits offline password guessing. Use a long, unique credential and do not reuse it for any other service.

Use server-side authentication or an identity-aware proxy for genuine access control.
