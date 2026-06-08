# UI/UX & Design Guidelines

InstaFlow AI places a **massive emphasis on aesthetics and premium user experience**. Any AI agent modifying the UI must strictly adhere to these rules.

## 1. Strict Styling Constraints
- **Tailwind CSS ONLY**: Do not write custom CSS in `index.css` unless defining core theme variables or keyframe animations. Use Tailwind utility classes for all styling.
- **No Additional Component Libraries**: Do NOT install libraries like Material UI, Ant Design, Chakra UI, or Bootstrap. Stick to raw React + Tailwind.
- **Icons**: Only use `lucide-react`.

## 2. Aesthetic Principles
- **Premium Feel**: Avoid flat, boring colors (like plain red or plain blue). Use Tailwind's rich color palettes (e.g., `slate`, `indigo`, `pink`, `rose`).
- **Gradients & Glassmorphism**: Use soft background gradients (`bg-gradient-to-r`, `bg-gradient-to-br`) and frosted glass effects (`backdrop-blur-md`, `bg-white/70`).
- **Rounded Corners**: Generous border radiuses (`rounded-xl`, `rounded-2xl`, `rounded-3xl`) are preferred over sharp edges.

## 3. Micro-Animations & Interactions
- **Transitions**: Every interactive element (buttons, inputs) MUST have a smooth transition. Use `transition-all duration-300` or `transition-colors`.
- **Hover/Focus States**: Buttons must have distinct hover states (e.g., `hover:-translate-y-0.5`, `hover:shadow-md`). Inputs must have clear focus rings (`focus:ring-2`, `focus:border-indigo-500`, `outline-none`).

## 4. Component Specifics
- **Inputs & Textareas**: Follow the established pattern in `FormTabs.tsx`. If an input is invalid, it MUST use the error styling: `border-red-300 bg-red-50/5 dark:bg-red-500/5 focus:border-red-500 focus:ring-1 focus:ring-red-500`.
- **Resizability**: For textareas, disable manual resizing if it causes layout shift (`resize-none`) and provide a generous `min-h-[100px]`.
