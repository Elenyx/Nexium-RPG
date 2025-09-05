const legendaryCharacters = [
  {
    id: 'NL001',
    name: 'Jiraiya',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL001.png',
    baseStats: {
      health: 2000,
      attack: 250,
      defense: 170,
      speed: 160,
      chakra: 350
    },
    abilities: [
      {
        name: 'Sage Mode',
        description: 'Enhanced perception and power through sage chakra',
        type: 'transformation',
        damage: 0,
        chakraCost: 100,
        cooldown: 6
      },
      {
        name: 'Rasengan Barrage',
        description: 'Multiple powerful rasengan attacks',
        type: 'attack',
        damage: 320,
        chakraCost: 80,
        cooldown: 4
      }
    ],
    description: 'The legendary sannin in Sage Mode. Master of sage techniques and powerful combat.'
  },

  {
    id: 'NL002',
    name: 'Tsunade Senju',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL002.png',
    baseStats: {
      health: 2200,
      attack: 240,
      defense: 200,
      speed: 140,
      chakra: 380
    },
    abilities: [
      {
        name: 'Strength of a Hundred Seal',
        description: 'Massive strength boost with monstrous power',
        type: 'buff',
        damage: 0,
        chakraCost: 90,
        cooldown: 5
      },
      {
        name: 'Creation Rebirth',
        description: 'Regenerates health by converting chakra',
        type: 'support',
        damage: 0,
        chakraCost: 120,
        cooldown: 8
      }
    ],
    description: 'The legendary medical ninja and Fifth Hokage. Incredible strength and healing abilities.'
  },

  {
    id: 'NL003',
    name: 'Orochimaru',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL003.png',
    baseStats: {
      health: 1800,
      attack: 230,
      defense: 150,
      speed: 180,
      chakra: 320
    },
    abilities: [
      {
        name: 'Living Corpse Reincarnation',
        description: 'Possesses bodies and steals abilities',
        type: 'control',
        damage: 200,
        chakraCost: 85,
        cooldown: 5
      },
      {
        name: 'Regeneration',
        description: 'Regenerates from fatal wounds',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'The legendary sannin and master of forbidden techniques. Immortal through regeneration.'
  },

  {
    id: 'NL004',
    name: 'Gaara',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL004.png',
    baseStats: {
      health: 2100,
      attack: 260,
      defense: 190,
      speed: 150,
      chakra: 340
    },
    abilities: [
      {
        name: 'Sand Coffin',
        description: 'Traps enemies in crushing sand',
        type: 'control',
        damage: 250,
        chakraCost: 70,
        cooldown: 4
      },
      {
        name: 'Desert Imperial Funeral',
        description: 'Ultimate sand burial technique',
        type: 'attack',
        damage: 350,
        chakraCost: 100,
        cooldown: 6
      }
    ],
    description: 'The Fifth Kazekage. Master of sand manipulation with absolute defense.'
  },

  {
    id: 'NL005',
    name: 'Fourth Raikage',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL005.png',
    baseStats: {
      health: 2300,
      attack: 280,
      defense: 210,
      speed: 200,
      chakra: 300
    },
    abilities: [
      {
        name: 'Lariat',
        description: 'Powerful lightning-infused punch',
        type: 'attack',
        damage: 330,
        chakraCost: 75,
        cooldown: 4
      },
      {
        name: 'Lightning Release Armor',
        description: 'Coats body in lightning for defense and attack',
        type: 'buff',
        damage: 0,
        chakraCost: 80,
        cooldown: 5
      }
    ],
    description: 'The Fourth Raikage A. Fastest ninja with incredible physical strength.'
  },

  {
    id: 'NL006',
    name: 'Third Raikage',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL006.png',
    baseStats: {
      health: 2500,
      attack: 270,
      defense: 230,
      speed: 170,
      chakra: 290
    },
    abilities: [
      {
        name: 'Hell Stab',
        description: 'Powerful elbow strike that pierces defenses',
        type: 'attack',
        damage: 340,
        chakraCost: 85,
        cooldown: 5
      },
      {
        name: 'Strongest Spear',
        description: 'Ultimate lightning spear attack',
        type: 'attack',
        damage: 360,
        chakraCost: 95,
        cooldown: 6
      }
    ],
    description: 'The legendary Third Raikage. Known as the strongest ninja with unmatched durability.'
  },

  {
    id: 'NL007',
    name: 'Onoki',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL007.png',
    baseStats: {
      health: 1900,
      attack: 220,
      defense: 180,
      speed: 130,
      chakra: 330
    },
    abilities: [
      {
        name: 'Dust Release: Detachment of the Primitive World',
        description: 'Molecular destruction technique',
        type: 'attack',
        damage: 380,
        chakraCost: 110,
        cooldown: 7
      },
      {
        name: 'Lightened Body Technique',
        description: 'Makes body extremely light for flight',
        type: 'support',
        damage: 0,
        chakraCost: 60,
        cooldown: 4
      }
    ],
    description: 'The Third Tsuchikage. Master of dust release and flight techniques.'
  },

  {
    id: 'NL008',
    name: 'Mei Terumi',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL008.png',
    baseStats: {
      health: 1950,
      attack: 235,
      defense: 165,
      speed: 155,
      chakra: 310
    },
    abilities: [
      {
        name: 'Lava Release: Melting Apparition',
        description: 'Creates and controls lava',
        type: 'attack',
        damage: 290,
        chakraCost: 75,
        cooldown: 4
      },
      {
        name: 'Boil Release: Unrivaled Strength',
        description: 'Scalding hot water attacks',
        type: 'attack',
        damage: 270,
        chakraCost: 70,
        cooldown: 4
      }
    ],
    description: 'The Fifth Mizukage. Master of lava and boil release techniques.'
  },

  {
    id: 'NL009',
    name: 'Kisame Hoshigaki',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL009.png',
    baseStats: {
      health: 2400,
      attack: 245,
      defense: 200,
      speed: 145,
      chakra: 320
    },
    abilities: [
      {
        name: 'Water Prison Shark Dance',
        description: 'Summons sharks in water prison',
        type: 'summon',
        damage: 300,
        chakraCost: 85,
        cooldown: 5
      },
      {
        name: 'Samehada',
        description: 'Absorbs chakra with the legendary sword',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'The monster of the Hidden Mist. Wields the chakra-absorbing sword Samehada.'
  },

  {
    id: 'NL010',
    name: 'Deidara',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL010.png',
    baseStats: {
      health: 1750,
      attack: 255,
      defense: 140,
      speed: 165,
      chakra: 290
    },
    abilities: [
      {
        name: 'C4 Karura',
        description: 'Explosive clay bird that seeks targets',
        type: 'attack',
        damage: 350,
        chakraCost: 90,
        cooldown: 5
      },
      {
        name: 'Exploding Clay',
        description: 'Creates various explosive clay constructs',
        type: 'summon',
        damage: 220,
        chakraCost: 60,
        cooldown: 3
      }
    ],
    description: 'The explosive artist of Akatsuki. Creates art through destruction.'
  },

  {
    id: 'NL011',
    name: 'Sasori',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL011.png',
    baseStats: {
      health: 1850,
      attack: 240,
      defense: 160,
      speed: 140,
      chakra: 300
    },
    abilities: [
      {
        name: 'Red Secret Technique: Performance of a Hundred Puppets',
        description: 'Controls hundreds of puppets simultaneously',
        type: 'summon',
        damage: 280,
        chakraCost: 80,
        cooldown: 5
      },
      {
        name: 'Poison Gas',
        description: 'Releases deadly poison from puppets',
        type: 'debuff',
        damage: 160,
        chakraCost: 50,
        cooldown: 4
      }
    ],
    description: 'The puppet master of Akatsuki. Controls deadly poison puppets.'
  },

  {
    id: 'NL012',
    name: 'Konan',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL012.png',
    baseStats: {
      health: 1800,
      attack: 225,
      defense: 155,
      speed: 175,
      chakra: 340
    },
    abilities: [
      {
        name: 'Paper Shuriken',
        description: 'Explosive paper shuriken barrage',
        type: 'attack',
        damage: 260,
        chakraCost: 65,
        cooldown: 3
      },
      {
        name: 'Dance of the Shikigami',
        description: 'Creates paper clones and constructs',
        type: 'summon',
        damage: 240,
        chakraCost: 70,
        cooldown: 4
      }
    ],
    description: 'The angel of Akatsuki. Master of paper manipulation techniques.'
  },

  {
    id: 'NL013',
    name: 'Zabuza Momochi',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL013.png',
    baseStats: {
      health: 2150,
      attack: 265,
      defense: 185,
      speed: 190,
      chakra: 280
    },
    abilities: [
      {
        name: 'Silent Killing',
        description: 'Assassination technique with water clones',
        type: 'attack',
        damage: 310,
        chakraCost: 75,
        cooldown: 4
      },
      {
        name: 'Water Prison Technique',
        description: 'Traps enemies in inescapable water sphere',
        type: 'control',
        damage: 180,
        chakraCost: 60,
        cooldown: 5
      }
    ],
    description: 'The demon of the Hidden Mist. Master assassin with silent killing techniques.'
  },

  {
    id: 'NL014',
    name: 'Hiruzen Sarutobi',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL014.png',
    baseStats: {
      health: 2050,
      attack: 235,
      defense: 175,
      speed: 160,
      chakra: 360
    },
    abilities: [
      {
        name: 'Dead Demon Consuming Seal',
        description: 'Seals away enemy abilities and chakra',
        type: 'control',
        damage: 200,
        chakraCost: 90,
        cooldown: 6
      },
      {
        name: 'Fire Release: Phoenix Flower Jutsu',
        description: 'Multiple fire balls for area damage',
        type: 'attack',
        damage: 280,
        chakraCost: 70,
        cooldown: 4
      }
    ],
    description: 'The Third Hokage in his prime. Master of all five basic chakra natures.'
  },

  {
    id: 'NL015',
    name: 'Sasuke - Heavenly Hand Power',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL015.png',
    baseStats: {
      health: 2100,
      attack: 280,
      defense: 200,
      speed: 210,
      chakra: 370
    },
    abilities: [
      {
        name: 'Universal Pull',
        description: 'Pulls enemies towards you with gravitational force',
        type: 'control',
        damage: 200,
        chakraCost: 70,
        cooldown: 4
      },
      {
        name: 'Chibaku Tensei',
        description: 'Creates a small planet to trap enemies',
        type: 'control',
        damage: 330,
        chakraCost: 100,
        cooldown: 6
      }
    ],
    description: 'Sasuke\'s Rinnegan technique for absorption and repulsion. Chakra manipulation mastery.'
  },

  {
    id: 'NL016',
    name: 'Susanoo Skeletal Form',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL016.png',
    baseStats: {
      health: 2150,
      attack: 285,
      defense: 205,
      speed: 215,
      chakra: 375
    },
    abilities: [
      {
        name: 'Skeletal Strike',
        description: 'Powerful bone-like chakra attacks',
        type: 'attack',
        damage: 360,
        chakraCost: 85,
        cooldown: 5
      },
      {
        name: 'Susanoo Armor',
        description: 'Enhanced defensive capabilities',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Intermediate Susanoo with skeletal structure. Enhanced offensive capabilities.'
  },

  {
    id: 'NL017',
    name: 'Kimimaro (Sound Five) - Shikotsumyaku (Kekkei Genkai)',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL017.png',
    baseStats: {
      health: 2050,
      attack: 275,
      defense: 195,
      speed: 220,
      chakra: 360
    },
    abilities: [
      {
        name: 'Bone Bullets',
        description: 'Fires sharp bone projectiles',
        type: 'attack',
        damage: 340,
        chakraCost: 75,
        cooldown: 4
      },
      {
        name: 'Bone Armor',
        description: 'Creates defensive bone structures',
        type: 'defense',
        damage: 0,
        chakraCost: 60,
        cooldown: 3
      }
    ],
    description: 'Kimimaro\'s bone manipulation bloodline. Deadly close-range combat with bone weapons.'
  },

  {
    id: 'NL018',
    name: 'Naruto Uzumaki - Four-Tails Transformation',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/NL018.png',
    baseStats: {
      health: 2200,
      attack: 270,
      defense: 190,
      speed: 200,
      chakra: 380
    },
    abilities: [
      {
        name: 'Four-Tails Rage',
        description: 'Powerful chakra burst with enhanced strength',
        type: 'attack',
        damage: 350,
        chakraCost: 90,
        cooldown: 5
      },
      {
        name: 'Tailed Beast Armor',
        description: 'Chakra armor provides superior defense',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Naruto partially transformed into the four-tails. Raw power with enhanced durability.'
  }
];

module.exports = legendaryCharacters;
