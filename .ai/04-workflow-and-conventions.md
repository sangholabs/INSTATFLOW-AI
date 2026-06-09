# Workflow & Code Conventions

All AI agents must follow these operational rules when modifying this codebase.

## 1. Code Comments (Korean Required)
- **ALL newly added comments in the codebase MUST be written in Korean.**
- Maintain existing Korean comments. Do not delete them or translate them to English unless explicitly instructed.
- When explaining complex logic (e.g., inside `useEffect` or complex state reducers), add a brief Korean comment explaining the *why*, not just the *what*.

## 2. State Management
- The global state (e.g., `payload`) is managed at the top level in `App.tsx` and passed down via props to `FormTabs` and `InstagramMockup`.
- Do not introduce Redux, Zustand, or Context API unless the prop drilling becomes demonstrably unmanageable and the user approves.
- When modifying state, ensure immutable updates are performed correctly.

## 3. Git Commits & Pull Requests
- Use semantic commit messages (e.g., `feat:`, `fix:`, `style:`, `refactor:`).
- Be descriptive about what changed.
- **Pull Requests (PR)**: Whenever performing a `git push` to the repository, you MUST always write a PR (Pull Request) description/summary for the user. Summarize the changes, what was fixed, and any next steps so the user can easily open a PR on GitHub.

## 4. General AI Agent Rules
- If asked to fix a bug, trace the data flow from `App.tsx` down to the component, and check the backend proxy in `server.ts` before making assumptions.
- If the user asks for a design change, immediately consult `.ai/02-ui-ux-guidelines.md` to ensure the change meets the aesthetic standards.
