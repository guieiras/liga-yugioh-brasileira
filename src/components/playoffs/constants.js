export const ROUNDS = [
  {
    name: 'top32',
    steps: [
      { name: 'top32', index: 32, games: 16 }
    ]
  },
  {
    name: 'top16',
    steps: [
      { name: 'top16', index: 16, games: 8 }
    ]
  },
  {
    name: 'top8',
    steps: [
      { name: 'top8', index: 8, games: 4 }
    ]
  },
  {
    name: 'qualifiers',
    steps: [
      { name: 'top4', index: 4, games: 2 },
      { name: 'recap', index: 7, games: 1 }
    ]
  },
  {
    name: 'finals',
    steps: [
      { name: 'promotion', index: 5, games: 1 },
      { name: 'third', index: 3, games: 1 },
      { name: 'final', index: 1, games: 1 }
    ]
  }
]
