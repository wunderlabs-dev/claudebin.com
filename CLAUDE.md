# Project Rules

## Code Style

- **ALWAYS prefer arrow functions** over function declarations or function expressions. Use arrow functions for all function definitions unless there's a specific technical reason not to (e.g., when `this` binding is required).

```typescript
// GOOD: Arrow function
const myFunction = () => {
  // ...
};

const asyncFunction = async () => {
  // ...
};

// BAD: Function declaration
function myFunction() {
  // ...
}

// BAD: Function expression
const myFunction = function() {
  // ...
};
```
