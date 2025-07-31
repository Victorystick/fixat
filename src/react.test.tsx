import { test, expect, describe } from 'vitest';
import { testing } from './vitest';
import { fixture } from './fixture';
import { createContext, use } from 'react';
import { react } from './react';
import '@testing-library/jest-dom';

const ListContext = createContext<readonly number[]>([]);

// An example fixture that injects a list.
const list = fixture({ react }, ({ react }) => {
    const list: number[] = [];

    react.wrap(({ children }) => <ListContext value={list.slice()}>{children}</ListContext>)

    return list;
});

// A simple hook that reads the list context.
function useNumbers() {
    return use(ListContext);
}

describe('useNumbers', () => {
    const state = testing({ react, list });

    test('returns empty list by default', () => {
        const { result } = state.react.renderHook(useNumbers);

        expect(result.current).toEqual([]);
    });

    test('returns list with numbers added', () => {
        state.list.push(1, 2, 3);

        const { result } = state.react.renderHook(useNumbers);

        expect(result.current).toEqual([1, 2, 3]);
    });

    test('adding numbers after render has no effect (due to slice())', () => {
        state.list.push(1, 2);

        const { result } = state.react.renderHook(useNumbers);

        state.list.push(3);

        expect(result.current).toEqual([1, 2]);
    });
});

function NumberList() {
    const nums = useNumbers();

    return nums.map((num) => <p>{num}</p>);
}

describe('NumberList', () => {
    const state = testing({ react, list });

    test('returns empty list by default', () => {
        const { container } = state.react.render(<NumberList />);

        expect(container).toBeEmptyDOMElement();
    });
});