# Contributing to Portal Web3

We love your input! We want to make contributing to Portal Web3 as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Security

Security is a top priority. When contributing, please:

1. **Never** commit sensitive information (keys, passwords, etc.)
2. Run `pnpm security-audit` before submitting PRs
3. Keep dependencies up to date
4. Follow security best practices in [SECURITY.md](SECURITY.md)
5. Report security vulnerabilities privately

## Development Process

1. Fork the repo and create your branch from `main`
2. Install dependencies with `pnpm install`
3. Make your changes
4. Run tests and security checks:
   ```bash
   pnpm lint
   pnpm security-audit
   pnpm security-check
   ```
5. Create a pull request

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the SECURITY.md if you're changing security-related features
3. The PR will be merged once you have the sign-off of maintainers

## Code Style

- Use TypeScript
- Follow ESLint rules
- Write meaningful commit messages following conventional commits
- Document security implications of changes

## License

By contributing, you agree that your contributions will be licensed under its MIT License. 