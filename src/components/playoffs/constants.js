export const ROUNDS = [
  {
    name: 'top32',
    steps: [
      { name: 'top32', index: 32 }
    ]
  },
  {
    name: 'top16',
    steps: [
      { name: 'top16', index: 16 }
    ]
  },
  {
    name: 'top8',
    steps: [
      { name: 'top8', index: 8 }
    ]
  },
  {
    name: 'qualifiers',
    steps: [
      { name: 'top4', index: 4 },
      { name: 'recap', index: 7 }
    ]
  },
  {
    name: 'finals',
    steps: [
      { name: 'final', index: 1 },
      { name: 'third', index: 3 },
      { name: 'promotion', index: 5 }
    ]
  }
]
