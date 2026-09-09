import type { Page } from '@playwright/test';

export const noteRegistrationLocators = (page: Page) => {
  const modal = page.getByRole('dialog');

  return {
    modal,
    category: modal.getByTestId('note-category'),
    title: modal.getByTestId('note-title'),
    description: modal.getByTestId('note-description'),
    submit: modal.getByTestId('note-submit'),
    update: page.getByRole('button', { name: /update/i }),
  };
};
