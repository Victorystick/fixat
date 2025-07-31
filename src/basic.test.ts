import { test, expect, describe } from 'vitest';
import { setup, testing } from './testing';
import { fixture } from './fixture';

const int = fixture(() => 1);

test('initializes', () => {
    const state = setup({ int });

    expect(state.int).toBe(1);
});

describe('multiple tests', () => {
    const state = testing({ int });

    test('gets value set', () => {
        expect(state.int).toBe(1);
    });
});