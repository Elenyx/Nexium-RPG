const mythicCharacters = [
  {
    id: 'NM001',
    name: 'Naruto Uzumaki (Kurama Chakra Mode)',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/naruto-kcm.png',
    baseStats: {
      health: 2800,
      attack: 320,
      defense: 220,
      speed: 250,
      chakra: 450
    },
    abilities: [
      {
        name: 'Kurama Avatar',
        description: 'Transforms into Kurama avatar with massive power',
        type: 'transformation',
        damage: 0,
        chakraCost: 150,
        cooldown: 8
      },
      {
        name: 'Rasenshuriken',
        description: 'Wind-infused rasengan with devastating power',
        type: 'attack',
        damage: 420,
        chakraCost: 120,
        cooldown: 6
      }
    ],
    description: 'Naruto in Kurama Chakra Mode. Unparalleled speed and power with nine-tailed fox chakra.'
  },

  {
    id: 'NM002',
    name: 'Sasuke Uchiha (Eternal Mangekyo Sharingan)',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/sasuke-ems.png',
    baseStats: {
      health: 2600,
      attack: 340,
      defense: 200,
      speed: 280,
      chakra: 420
    },
    abilities: [
      {
        name: 'Indra\'s Arrow',
        description: 'Ultimate lightning arrow with infinite power',
        type: 'attack',
        damage: 450,
        chakraCost: 140,
        cooldown: 7
      },
      {
        name: 'Susanoo',
        description: 'Complete Susanoo with full power',
        type: 'summon',
        damage: 380,
        chakraCost: 130,
        cooldown: 6
      }
    ],
    description: 'Sasuke with Eternal Mangekyo Sharingan. Master of all Uchiha techniques.'
  },

  {
    id: 'NM003',
    name: 'Might Guy (8th Gate)',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/guy-8th-gate.png',
    baseStats: {
      health: 2700,
      attack: 350,
      defense: 240,
      speed: 300,
      chakra: 380
    },
    abilities: [
      {
        name: 'Morning Peacock',
        description: 'Opens 8 gates for ultimate taijutsu power',
        type: 'transformation',
        damage: 0,
        chakraCost: 160,
        cooldown: 10
      },
      {
        name: 'Evening Elephant',
        description: 'Massive punch with gate-enhanced strength',
        type: 'attack',
        damage: 430,
        chakraCost: 110,
        cooldown: 5
      }
    ],
    description: 'Guy with all 8 gates open. The pinnacle of taijutsu mastery.'
  },

  {
    id: 'NM004',
    name: 'Kakashi Hatake (Double Mangekyo Sharingan)',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/kakashi-obito-eye.png',
    baseStats: {
      health: 2500,
      attack: 310,
      defense: 190,
      speed: 270,
      chakra: 400
    },
    abilities: [
      {
        name: 'Kamui',
        description: 'Space-time manipulation with phasing abilities',
        type: 'control',
        damage: 350,
        chakraCost: 100,
        cooldown: 5
      },
      {
        name: 'Raikiri',
        description: 'Lightning blade that pierces through anything',
        type: 'attack',
        damage: 390,
        chakraCost: 95,
        cooldown: 4
      }
    ],
    description: 'Kakashi with Obito\'s Sharingan. Master of space-time ninjutsu.'
  },

  {
    id: 'NM005',
    name: 'Minato Namikaze (Edo Tensei)',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/minato-edo.png',
    baseStats: {
      health: 2400,
      attack: 290,
      defense: 180,
      speed: 350,
      chakra: 430
    },
    abilities: [
      {
        name: 'Flying Thunder God',
        description: 'Instant teleportation to marked locations',
        type: 'support',
        damage: 0,
        chakraCost: 80,
        cooldown: 3
      },
      {
        name: 'Rasengan',
        description: 'The original rasengan with perfect form',
        type: 'attack',
        damage: 360,
        chakraCost: 85,
        cooldown: 4
      }
    ],
    description: 'The Fourth Hokage resurrected. The fastest ninja with space-time techniques.'
  },

  {
    id: 'NM006',
    name: 'Hashirama Senju',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/hashirama.png',
    baseStats: {
      health: 3000,
      attack: 330,
      defense: 260,
      speed: 220,
      chakra: 480
    },
    abilities: [
      {
        name: 'Wood Release: Wooden Human',
        description: 'Creates powerful wooden constructs',
        type: 'summon',
        damage: 320,
        chakraCost: 110,
        cooldown: 5
      },
      {
        name: 'Sage Art: Gate of the Great God',
        description: 'Ultimate wood release technique',
        type: 'attack',
        damage: 460,
        chakraCost: 150,
        cooldown: 8
      }
    ],
    description: 'The First Hokage. God of shinobi with unmatched vitality and wood release.'
  },

  {
    id: 'NM007',
    name: 'Itachi Uchiha (Edo Tensei)',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/itachi-edo.png',
    baseStats: {
      health: 2300,
      attack: 280,
      defense: 170,
      speed: 240,
      chakra: 410
    },
    abilities: [
      {
        name: 'Tsukuyomi',
        description: 'Ultimate genjutsu that traps in illusions',
        type: 'control',
        damage: 300,
        chakraCost: 120,
        cooldown: 6
      },
      {
        name: 'Amaterasu',
        description: 'Black flames that burn eternally',
        type: 'attack',
        damage: 370,
        chakraCost: 100,
        cooldown: 5
      }
    ],
    description: 'Itachi resurrected. Master of genjutsu with perfect Sharingan abilities.'
  },

  {
    id: 'NM008',
    name: 'Nagato (Pain)',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/pain.png',
    baseStats: {
      health: 2750,
      attack: 315,
      defense: 210,
      speed: 230,
      chakra: 460
    },
    abilities: [
      {
        name: 'Universal Pull',
        description: 'Pulls enemies with gravitational force',
        type: 'control',
        damage: 280,
        chakraCost: 90,
        cooldown: 4
      },
      {
        name: 'Chibaku Tensei',
        description: 'Creates miniature moon to trap enemies',
        type: 'control',
        damage: 400,
        chakraCost: 140,
        cooldown: 7
      }
    ],
    description: 'Nagato controlling Pain bodies. Master of the Rinnegan with god-like powers.'
  },

  {
    id: 'NM009',
    name: 'Killer Bee (8-Tailed Form)',
    anime: 'Naruto',
    rarity: 'MYTHIC',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/killer-bee-8tails.png',
    baseStats: {
      health: 2850,
      attack: 325,
      defense: 230,
      speed: 260,
      chakra: 440
    },
    abilities: [
      {
        name: '8-Tailed Transformation',
        description: 'Transforms into 8-tailed form with immense power',
        type: 'transformation',
        damage: 0,
        chakraCost: 145,
        cooldown: 7
      },
      {
        name: 'Lariat Barrage',
        description: 'Multiple powerful lariat attacks',
        type: 'attack',
        damage: 380,
        chakraCost: 105,
        cooldown: 5
      }
    ],
    description: 'Killer Bee in 8-tailed form. Master rapper and tailed beast host.'
  }
];

module.exports = mythicCharacters;
