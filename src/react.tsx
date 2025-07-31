import { JSXElementConstructor, ReactNode } from 'react';
import { render, renderHook } from '@testing-library/react';
import { fixture } from "./fixture";

type Wrapper = JSXElementConstructor<{ children: ReactNode }>;

/**
 * Wraps `@testing-library/react` with
 */
export const react = fixture(() => {
    const stack: Wrapper[] = [];
    const wrapper: Wrapper = ({ children }) => {
        return stack.reduceRight((children, Wrapper) => <Wrapper>{children}</Wrapper>, children);
    };

    return {
        /**
         * Wraps what the test is about to render in a {@link Wrapper}. Ideal
         * for adding Provider components prior to rendering.
         */
        wrap(wrapper: Wrapper) {
            stack.push(wrapper);
        },

        /** Renders a `node` in the context of a set of wrappers. */
        render(node: ReactNode) {
            return render(node, { wrapper });
        },

        /** Renders a `hook` in the context of a set of wrappers. */
        renderHook<Props, Result>(hook: (props: Props) => Result) {
            return renderHook(hook, { wrapper });
        },
    }
});
