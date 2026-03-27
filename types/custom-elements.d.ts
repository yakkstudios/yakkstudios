import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'w-sol-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        style?: React.CSSProperties & Record<string, string>;
      };
    }
  }
}
