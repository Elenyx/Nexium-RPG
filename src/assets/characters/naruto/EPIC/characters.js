const epicCharacters = [
  {
    id: 'NE001',
    name: 'Kakashi Hatake',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE001.png',
    baseStats: {
      health: 1600,
      attack: 200,
      defense: 140,
      speed: 170,
      chakra: 280
    },
    abilities: [
      {
        name: 'Chidori',
        description: 'Lightning-based piercing attack',
        type: 'attack',
        damage: 280,
        chakraCost: 70,
        cooldown: 4
      },
      {
        name: 'Sharingan',
        description: 'Predicts enemy movements and copies jutsu',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'The Copy Ninja of Konoha. Early Shippuden/Part 1 version with Sharingan abilities.'
  },

  {
    id: 'NE002',
    name: 'Might Guy',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE002.png',
    baseStats: {
      health: 1900,
      attack: 220,
      defense: 180,
      speed: 160,
      chakra: 250
    },
    abilities: [
      {
        name: 'Strong Fist',
        description: 'Powerful taijutsu strikes',
        type: 'attack',
        damage: 260,
        chakraCost: 50,
        cooldown: 3
      },
      {
        name: 'Leaf Hurricane',
        description: 'Spinning kick attack',
        type: 'attack',
        damage: 240,
        chakraCost: 45,
        cooldown: 3
      }
    ],
    description: 'The taijutsu master. Pre-8th Gate version focused on powerful physical techniques.'
  },

  {
    id: 'NE003',
    name: 'Shikamaru Nara',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE003.png',
    baseStats: {
      health: 1500,
      attack: 180,
      defense: 130,
      speed: 120,
      chakra: 260
    },
    abilities: [
      {
        name: 'Shadow Possession Jutsu',
        description: 'Advanced shadow manipulation that sews enemies together',
        type: 'control',
        damage: 150,
        chakraCost: 60,
        cooldown: 4
      },
      {
        name: 'Tactical Genius',
        description: 'Increases team damage by 25%',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'The brilliant strategist as a jonin. Advanced shadow techniques and tactical mastery.'
  },

  {
    id: 'NE004',
    name: 'Neji Hyuga',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE004.png',
    baseStats: {
      health: 1550,
      attack: 210,
      defense: 125,
      speed: 190,
      chakra: 240
    },
    abilities: [
      {
        name: 'Eight Trigrams Sixty-Four Palms',
        description: 'Rapid palm strikes hitting multiple chakra points',
        type: 'attack',
        damage: 270,
        chakraCost: 65,
        cooldown: 4
      },
      {
        name: 'Byakugan',
        description: '360-degree vision and chakra network insight',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'The prodigy of the Hyuga clan. Jonin-level Byakugan user with precise striking techniques.'
  },

  {
    id: 'NE005',
    name: 'Rock Lee',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE005.png',
    baseStats: {
      health: 1700,
      attack: 230,
      defense: 150,
      speed: 200,
      chakra: 220
    },
    abilities: [
      {
        name: 'Primary Lotus',
        description: 'Powerful spinning kick that builds up damage',
        type: 'attack',
        damage: 300,
        chakraCost: 80,
        cooldown: 5
      },
      {
        name: 'Drunken Fist',
        description: 'Unpredictable taijutsu style',
        type: 'attack',
        damage: 220,
        chakraCost: 40,
        cooldown: 3
      }
    ],
    description: 'The determined taijutsu specialist. Gated power version with incredible physical abilities.'
  },

  {
    id: 'NE006',
    name: 'Temari',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE006.png',
    baseStats: {
      health: 1450,
      attack: 190,
      defense: 135,
      speed: 165,
      chakra: 230
    },
    abilities: [
      {
        name: 'Wind Release: Gale Palm',
        description: 'Powerful wind blast that can deflect attacks',
        type: 'attack',
        damage: 240,
        chakraCost: 55,
        cooldown: 3
      },
      {
        name: 'Summoning: Giant Fan',
        description: 'Summons a massive fan for wind manipulation',
        type: 'summon',
        damage: 180,
        chakraCost: 50,
        cooldown: 4
      }
    ],
    description: 'The strategic fighter from Sand Village. Expert in wind release techniques.'
  },

  {
    id: 'NE007',
    name: 'Kankuro',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE007.png',
    baseStats: {
      health: 1520,
      attack: 185,
      defense: 140,
      speed: 130,
      chakra: 210
    },
    abilities: [
      {
        name: 'Puppet Technique',
        description: 'Controls puppets with chakra strings',
        type: 'summon',
        damage: 200,
        chakraCost: 45,
        cooldown: 3
      },
      {
        name: 'Poison Gas',
        description: 'Releases deadly poison from puppets',
        type: 'debuff',
        damage: 120,
        chakraCost: 40,
        cooldown: 4
      }
    ],
    description: 'The puppet master of Sand Village. Controls advanced puppets with deadly precision.'
  },

  {
    id: 'NE008',
    name: 'Choji Akimichi',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE008.png',
    baseStats: {
      health: 2200,
      attack: 180,
      defense: 200,
      speed: 100,
      chakra: 240
    },
    abilities: [
      {
        name: 'Butterfly Mode',
        description: 'Ultimate expansion technique with wings',
        type: 'transformation',
        damage: 0,
        chakraCost: 90,
        cooldown: 6
      },
      {
        name: 'Human Butterfly',
        description: 'Charges with butterfly wings for massive damage',
        type: 'attack',
        damage: 320,
        chakraCost: 75,
        cooldown: 5
      }
    ],
    description: 'Choji in his ultimate Butterfly mode. Massive size and strength with flight capabilities.'
  },

  {
    id: 'NE009',
    name: 'Shino Aburame',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE009.png',
    baseStats: {
      health: 1480,
      attack: 175,
      defense: 145,
      speed: 140,
      chakra: 250
    },
    abilities: [
      {
        name: 'Insect Clone',
        description: 'Creates insect clones for combat',
        type: 'summon',
        damage: 160,
        chakraCost: 50,
        cooldown: 3
      },
      {
        name: 'Parasitic Destruction Insect',
        description: 'Insects that destroy chakra from within',
        type: 'debuff',
        damage: 140,
        chakraCost: 55,
        cooldown: 4
      }
    ],
    description: 'The insect manipulator of Team 8. Controls deadly parasitic insects.'
  },

  {
    id: 'NE010',
    name: 'Hinata Hyuga',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE010.png',
    baseStats: {
      health: 1580,
      attack: 195,
      defense: 155,
      speed: 175,
      chakra: 270
    },
    abilities: [
      {
        name: 'Gentle Fist',
        description: 'Precise strikes that damage internal organs',
        type: 'attack',
        damage: 250,
        chakraCost: 60,
        cooldown: 3
      },
      {
        name: 'Byakugan',
        description: 'Advanced Byakugan with enhanced perception',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Hinata after the war. Confident and powerful with advanced Byakugan techniques.'
  },

  {
    id: 'NE011',
    name: 'Iruka Umino',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE011.png',
    baseStats: {
      health: 1650,
      attack: 170,
      defense: 160,
      speed: 135,
      chakra: 200
    },
    abilities: [
      {
        name: 'Flying Swallow',
        description: 'Precise kunai throw enhanced with chakra',
        type: 'attack',
        damage: 210,
        chakraCost: 40,
        cooldown: 2
      },
      {
        name: 'Mentor\'s Guidance',
        description: 'Increases ally attack speed',
        type: 'support',
        damage: 0,
        chakraCost: 35,
        cooldown: 3
      }
    ],
    description: 'The academy teacher and mentor. Skilled jonin with teaching expertise.'
  },

  {
    id: 'NE012',
    name: 'Naruto Uzumaki - Demon Cloak Form',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE012.png',
    baseStats: {
      health: 1800,
      attack: 240,
      defense: 160,
      speed: 180,
      chakra: 320
    },
    abilities: [
      {
        name: 'Nine-Tails Chakra Burst',
        description: 'Powerful chakra-enhanced attack',
        type: 'attack',
        damage: 300,
        chakraCost: 80,
        cooldown: 4
      },
      {
        name: 'Demon Cloak Defense',
        description: 'Chakra cloak provides enhanced defense',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Naruto\'s early Kurama cloak form. Enhanced strength and speed from nine-tails chakra.'
  },

  {
    id: 'NE013',
    name: 'Sasuke\'s Curse Mark',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE013.png',
    baseStats: {
      health: 1700,
      attack: 250,
      defense: 170,
      speed: 190,
      chakra: 300
    },
    abilities: [
      {
        name: 'Cursed Seal Enhancement',
        description: 'Boosts speed and power with dark chakra',
        type: 'buff',
        damage: 0,
        chakraCost: 60,
        cooldown: 3
      },
      {
        name: 'Orochimaru\'s Influence',
        description: 'Regenerates health over time',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Sasuke\'s cursed seal from Orochimaru. Enhanced speed and power with dark chakra.'
  },

  {
    id: 'NE014',
    name: 'Susanoo Rib Cage',
    anime: 'Naruto',
    rarity: 'EPIC',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NE014.png',
    baseStats: {
      health: 1750,
      attack: 255,
      defense: 175,
      speed: 185,
      chakra: 310
    },
    abilities: [
      {
        name: 'Rib Cage Defense',
        description: 'Creates defensive chakra armor',
        type: 'defense',
        damage: 0,
        chakraCost: 50,
        cooldown: 2
      },
      {
        name: 'Susanoo Energy',
        description: 'Basic Susanoo energy manipulation',
        type: 'attack',
        damage: 290,
        chakraCost: 75,
        cooldown: 4
      }
    ],
    description: 'Basic Susanoo form with rib cage armor. Defensive chakra construct.'
  }
];

module.exports = epicCharacters;
