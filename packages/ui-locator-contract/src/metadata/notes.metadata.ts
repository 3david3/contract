export const notesContractMetadata = {
  name: 'Notes',
  contractVersion: '1.256',
  owner: 'Team A - Locator QA',
  capabilities: [
    {
      name: 'open',
      description: 'Open the Notes application.',
      status: 'implemented',
    },
    {
      name: 'openCreateNoteForm',
      description: 'Open the New Note form.',
      status: 'implemented',
    },
    {
      name: 'createNote',
      description: 'Create a new note.',
      status: 'implemented',
    },
  ],
} as const;
