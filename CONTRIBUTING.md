# Contributing to Claudebin

Thanks for your interest in contributing to Claudebin!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `bun install`
4. Copy environment variables: `cp app/.env.example app/.env.local`
5. Start the dev server: `bun dev`

## Development Workflow

### Before submitting a PR

1. Run linting: `bun check`
2. Run type checking: `bun type-check`
3. Test your changes locally

### Code Style

- We use [Biome](https://biomejs.dev/) for linting and formatting
- Run `bun format` to auto-format code
- Follow existing patterns in the codebase

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `chore:` maintenance tasks
- `refactor:` code refactoring
- `style:` formatting changes

### Pull Requests

We'd love to see your contributions! When submitting a PR, please:

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all checks pass
4. Include a link to the Claudebin thread (via `/claudebin:share`) in your PR description — it helps reviewers follow your thought process and makes reviews way more fun
5. Submit a PR to `develop`
6. Wait for review

## Project Structure

```
app/src/
├── app/          # Next.js pages and API routes
├── components/   # React components
├── containers/   # Components with data fetching
├── server/       # Backend logic
│   ├── actions/  # Server actions
│   ├── repos/    # Data access layer
│   └── services/ # Business logic
└── context/      # React context providers
```

## Need Help?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
