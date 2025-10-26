import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

// NOTE: This test is from React's default template
// Should be removed or updated based on actual App implementation
test.skip('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
