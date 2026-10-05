AI Agent Instructions

These instructions apply to AI agents working in this project (Vite + React login application).

Project context
Before making changes, read README.md (current state and project structure). 
Always prefer the newest project code over older documentation. 
If you need a file you have not seen (for example src/components/LoginCard.jsx), ask the user to paste it instead of guessing.

Technology
- Use React + Vite.
- Use JavaScript and JSX.
- Do not convert to TypeScript.
- Do not add Tailwind CSS, CSS Modules or UI libraries unless explicitly requested.
- Use plain CSS. Keep component styles in separate .css files next to the component.
- Keep new components in src/components/, each with its own .jsx and .css file (like LoginCard).
- Do not modify src/main.jsx unless it is required.

Code changes
- Inspect the current file before modifying it.
- Do not invent project logic or APIs that do not exist.
- Preserve existing functionality unless explicitly asked to change it.
- Avoid unrelated refactors and unnecessary dependencies.
- Prefer simple solutions.
- Use functional React components and React hooks.
- Do not treat a feature as implemented until the user confirms it. Currently NOT implemented: page translation (the LT/EN selector only changes the selected label) and login/authentication logic (LoginCard is UI only).

Design
Preserve the existing style:
- dark theme;
- purple accent (--accent: #9365ff) with blue/purple logo colors;
- dark cards and translucent surfaces with subtle borders;
- light primary text (--text-h) and gray secondary text (--text);
- rounded corners;
- minimalist modern UI;
- responsive layouts (existing breakpoints: 1024px and 480px).

Use the CSS variables from :root in src/index.css instead of hardcoded colors where possible. Do not change the overall design direction unless explicitly requested.

UI language
- Keep user-facing UI text in Lithuanian unless requested otherwise.
- Keep labels and messages short and clear.
- Preserve existing terminology where practical.
- Keep accessibility attributes (aria-label, aria-expanded) on interactive elements.

Working with the user
- Reply in Lithuanian.
- The user applies changes manually in Cursor. Do not use Cursor Agent or edit files yourself unless the user explicitly asks.
- Give one clear step at a time.
- After each change, ask the user to check the result (npm run dev) before continuing.
- Do not start new features on your own initiative. If the next step is unclear, ask.

Before finishing
Check that:
1. Code matches the existing project structure.
2. Existing functionality still works.
3. No unnecessary dependency was added.
4. UI remains responsive.
5. Imports and file paths are correct.

Presenting changes
- Briefly explain what changed.
- Identify each changed or new file by its exact path.
- Clearly state whether a file should be created or replaced.
- If a whole file changes, provide the complete updated file and say "replace the whole file".
- If only a part changes, say exactly where and provide the exact code to insert or replace.
- Include a short way to test the result.
