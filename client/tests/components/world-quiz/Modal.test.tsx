import '@testing-library/jest-dom';
import React from 'react';
import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Modal} from '@components/world-quiz/Modal';

describe('Modal component', () => {
  it('renders title and content', () => {
    const title = 'My Modal Title';
    const content = 'My Modal Content';

    render(<Modal title={title} content={content} />);

    const modalTitleEl = screen.getByText(title);
    const modalContentEl = screen.getByText(content);

    expect(modalTitleEl).toBeInTheDocument();
    expect(modalContentEl).toBeInTheDocument();
  });
});
