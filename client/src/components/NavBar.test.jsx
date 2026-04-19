// Suppress React Router warnings in tests
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  console.warn.mockRestore();
});
import React from 'react';
import { render, screen } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

test('renders NavBar logo with alt text', () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );
  expect(screen.getByAltText(/FreshDish logo/i)).toBeInTheDocument();
});
