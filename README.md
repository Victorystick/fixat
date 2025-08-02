#  fixat

A library for test fixtures.

This library came about wanting to test React components without having to
manually compose wrappers as [suggested by the react-testing-library docs](https://testing-library.com/docs/react-testing-library/setup/#custom-render).
We only include the wrappers needed for each test.

```tsx
import { createContext, use } from 'react';
import { testing, fixture } from 'fixat';
import { react } from 'fixat/react';
import '@testing-library/jest-dom';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('light');

// Fixtures can specify other fixtures as dependencies,
// and return and API for use by tests.
const theme = fixture({ react }, ({ react }) => {
    let currentTheme: Theme = 'light';

    // Wraps any rendered components and hooks with the theme.
    react.wrap(({ children }) => <ThemeContext value={currentTheme}>{children}</ThemeContext>);

    return {
        setTheme(theme: Theme) {
            currentTheme = theme;
        },
    };
});

// An example component that just returns the current Theme.
function PrintTheme() {
    return use(ThemeContext);
}

// Initialize test state, initialized anew beforeEach test. This test uses
// react for rendering, and the above theme fixture.
const state = testing({ react, theme });

it('defaults to light', () => {
    const { container } = state.react.render(<PrintTheme />);

    expect(container).toHaveTextContent('light');
});

it('can be set to dark', () => {
    state.theme.set('dark');

    const { container } = state.react.render(<PrintTheme />);

    expect(container).toHaveTextContent('dark');
});
```