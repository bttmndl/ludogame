import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the ludo app shell', () => {
  render(<App />);
  expect(screen.getByText(/Ludo Mania/i)).toBeInTheDocument();
});
