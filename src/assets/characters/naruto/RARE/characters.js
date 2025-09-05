

const rareCharacters = [
  {
    id: 'NR001',
    name: 'Shikamaru Nara',
    anime: 'Naruto',
    rarity: 'RARE',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Shikamaru.png',
    baseStats: {
      health: 1400,
      attack: 160,
      defense: 120,
      speed: 110,
      chakra: 220
    },
    abilities: [
      {
        name: 'Shadow Possession Jutsu',
        description: 'Binds enemies with shadow manipulation',
        type: 'control',
        damage: 120,
        chakraCost: 45,
        cooldown: 3
      },
      {
        name: 'Strategic Mind',
        description: 'Increases team damage by 15%',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'The lazy genius strategist of Team 10. Chunin exam winner with exceptional tactical abilities.'
  },

  {
    id: 'NR002',
    name: 'Choji Akimichi',
    anime: 'Naruto',
    rarity: 'RARE',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Choji.png',
    baseStats: {
      health: 1800,
      attack: 140,
      defense: 160,
      speed: 105,
      chakra: 200
    },
    abilities: [
      {
        name: 'Expansion Jutsu',
        description: 'Increases size and strength dramatically',
        type: 'buff',
        damage: 0,
        chakraCost: 60,
        cooldown: 4
      },
      {
        name: 'Human Boulder',
        description: 'Charges forward with massive force',
        type: 'attack',
        damage: 250,
        chakraCost: 50,
        cooldown: 3
      }
    ],
    description: 'The loyal member of Team 10. Specializes in expansion techniques and brute strength.'
  },

  {
    id: 'NR003',
    name: 'Kiba Inuzuka',
    anime: 'Naruto',
    rarity: 'RARE',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Kiba.png',
    baseStats: {
      health: 1300,
      attack: 170,
      defense: 110,
      speed: 180,
      chakra: 190
    },
    abilities: [
      {
        name: 'Fang Over Fang',
        description: 'Powerful spinning attack with Akamaru',
        type: 'attack',
        damage: 220,
        chakraCost: 55,
        cooldown: 3
      },
      {
        name: 'Beast Human Clone',
        description: 'Transforms into a two-headed wolf',
        type: 'transformation',
        damage: 0,
        chakraCost: 70,
        cooldown: 5
      }
    ],
    description: 'The wild member of Team 8. Works closely with his ninja dog Akamaru in combat.'
  },

  {
    id: 'NR004',
    name: 'Ino Yamanaka',
    anime: 'Naruto',
    rarity: 'RARE',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Ino.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/COMMON/Ino.png',
      RARE: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Ino.png',
      EPIC: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/EPIC/Ino.png',
      LEGENDARY: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/LEGENDARY/Ino.png',
      MYTHIC: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/MYTHIC/Ino.png',
      DIMENSIONAL: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/DIMENSIONAL/Ino.png'
    },
    baseStats: {
      health: 1200,
      attack: 130,
      defense: 100,
      speed: 140,
      chakra: 240
    },
    abilities: [
      {
        name: 'Mind Transfer Jutsu',
        description: 'Possesses enemy bodies temporarily',
        type: 'control',
        damage: 100,
        chakraCost: 40,
        cooldown: 3
      },
      {
        name: 'Mind Destruction',
        description: 'Deals damage to enemy\'s mind',
        type: 'attack',
        damage: 180,
        chakraCost: 50,
        cooldown: 4
      }
    ],
    description: 'The elegant member of Team 10. Masters the art of mind manipulation techniques.'
  },

  {
    id: 'NR005',
    name: 'Tenten',
    anime: 'Naruto',
    rarity: 'RARE',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Tenten.png',
    baseStats: {
      health: 1250,
      attack: 160,
      defense: 115,
      speed: 130,
      chakra: 200
    },
    abilities: [
      {
        name: 'Weapon Summoning',
        description: 'Summons various weapons for combat',
        type: 'summon',
        damage: 150,
        chakraCost: 35,
        cooldown: 2
      },
      {
        name: 'Heavenly Chain of Destruction',
        description: 'Launches a barrage of weapons',
        type: 'attack',
        damage: 200,
        chakraCost: 60,
        cooldown: 4
      }
    ],
    description: 'The weapons specialist of Team Guy. Expert in all forms of weaponry and tools.'
  },

  {
    id: 'NR006',
    name: 'Anko Mitarashi',
    anime: 'Naruto',
    rarity: 'RARE',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Anko.png',
    baseStats: {
      health: 1350,
      attack: 175,
      defense: 125,
      speed: 150,
      chakra: 210
    },
    abilities: [
      {
        name: 'Snake Summoning',
        description: 'Summons snakes for combat assistance',
        type: 'summon',
        damage: 140,
        chakraCost: 40,
        cooldown: 3
      },
      {
        name: 'Hidden Shadow Snake Hands',
        description: 'Extends arms with snake-like appendages',
        type: 'attack',
        damage: 210,
        chakraCost: 65,
        cooldown: 4
      }
    ],
    description: 'The fierce tokubetsu jonin. Former student of Orochimaru with snake-based techniques.'
  },

  {
    id: 'NR007',
    name: 'Kurenai Yuhi',
    anime: 'Naruto',
    rarity: 'RARE',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Kurenai.png',
    baseStats: {
      health: 1280,
      attack: 135,
      defense: 128,
      speed: 145,
      chakra: 230
    },
    abilities: [
      {
        name: 'Genjutsu: Phantom Blaze',
        description: 'Illusion that creates phantom fire',
        type: 'control',
        damage: 160,
        chakraCost: 50,
        cooldown: 3
      },
      {
        name: 'Demonic Illusion: Tree Binding',
        description: 'Binds enemies with illusionary trees',
        type: 'control',
        damage: 120,
        chakraCost: 45,
        cooldown: 4
      }
    ],
    description: 'The genjutsu specialist jonin. Team 8\'s sensei with powerful illusion techniques.'
  },

  {
    id: 'NR008',
    name: 'Asuma Sarutobi',
    anime: 'Naruto',
    rarity: 'RARE',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Asuma.png',
    baseStats: {
      health: 1500,
      attack: 185,
      defense: 135,
      speed: 125,
      chakra: 195
    },
    abilities: [
      {
        name: 'Flying Swallow',
        description: 'Precise chakra-enhanced attacks',
        type: 'attack',
        damage: 230,
        chakraCost: 55,
        cooldown: 3
      },
      {
        name: 'Wind Release: Gale Palm',
        description: 'Powerful wind blast attack',
        type: 'attack',
        damage: 210,
        chakraCost: 60,
        cooldown: 4
      }
    ],
    description: 'The laid-back jonin of Team 10. Former member of the Twelve Guardian Ninja.'
  }
];

module.exports = rareCharacters;
