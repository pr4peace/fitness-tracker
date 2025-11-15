import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders branded header and navigation', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /easy fitness/i })).toBeInTheDocument();
    expect(screen.getByText(/hey, prashanth!/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log workout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument();
  });

  test('shows stats and recent activity cards on the home view', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 3, name: /workout stats/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /recent activities/i })).toBeInTheDocument();
  });
});
