# Portal Web3

A modern web3 dashboard built with React, TypeScript, and Vite.

## Project Structure

```
portal-web3/
├── apps/
│   └── web/          # Main web application
├── packages/
│   └── ui/           # Shared UI components
├── package.json      # Root package.json
└── tsconfig.json     # Root TypeScript configuration
```

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev
```

3. Build for production:
```bash
pnpm build
```

## Security

This project takes security seriously. We have implemented several measures to ensure code quality and security:

- Automated security scanning with CodeQL
- Weekly dependency updates via Dependabot
- Pre-commit hooks for code quality
- Regular security audits
- Automated vulnerability scanning

For more information about security, please see our [Security Policy](SECURITY.md).

### Security Scripts

```bash
# Run security audit
pnpm security-audit

# Check for outdated dependencies
pnpm security-check

# Update dependencies to latest versions
pnpm update-deps
```

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- pnpm (Package Manager)
- Monorepo Structure

## Development

This project uses pnpm workspaces to manage multiple packages. The main web application is located in `apps/web`.

### Development Best Practices

1. Keep dependencies up to date
2. Follow security guidelines in SECURITY.md
3. Run security checks before commits
4. Review dependency changes carefully
5. Use exact versions for dependencies

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Security Policy](SECURITY.md) before making a contribution.

## License

MIT 