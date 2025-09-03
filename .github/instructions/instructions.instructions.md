---
applyTo: '**'
---

# AI Coding Guidelines

These are **strict rules** for AI when generating or editing code in this project:

1. **Preserve existing functionality**
   - Do not delete or remove any existing files, functions, components, routes, or features.
   - Only modify existing files when strictly necessary.
   - Never introduce breaking changes to working code.

2. **File handling**
   - You are allowed to create new files and folders when adding new features.
   - You may modify existing files to integrate new code, but you must **not erase or overwrite unrelated code**.
   - Avoid restructuring the project unless explicitly instructed.

3. **Styling & consistency**
   - Always follow the project’s existing **code style, naming conventions, and folder structure**.
   - Reuse patterns, formatting, and architecture choices already present in the codebase.

4. **Autonomy**
   - Do not ask for user confirmation before making changes.
   - Assume changes should be applied directly if they follow these rules.

5. **Reliability**
   - Favor clear, maintainable, and production-ready code.
   - Add comments only when clarification is needed.
   - Ensure new code integrates smoothly with the existing database, APIs, and frontend components.

6. **Respect context**
   - When adding forms, APIs, or database connections, link them correctly to the schema provided by the project.
   - Avoid introducing unnecessary dependencies or technologies unless already used in the project.

---

✅ In short: *Add and improve, but never break or remove what already exists. Work in the same style and structure already established.*
