
import React from 'react';
import { render, screen } from '@testing-library/react';
import MenuCard from './MenuCard';

test('renders menu card with title', () => {
  const mockItem = {
    name: 'Pizza',
    description: 'Delicious pizza',
    price: 12.99,
    image: '',
    popular: true,
  };
  render(<MenuCard item={mockItem} onAdd={() => {}} />);
  expect(screen.getByText('Pizza')).toBeInTheDocument();
});
