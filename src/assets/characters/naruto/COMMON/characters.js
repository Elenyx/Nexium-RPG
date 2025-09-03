const commonCharacters = [
  {
    id: 'NC001',
    name: 'Naruto Uzumaki',
    anime: 'Naruto',
    rarity: 'COMMON',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/naruto-academy.png',
    baseStats: {
      health: 1200,
      attack: 150,
      defense: 100,
      speed: 140,
      chakra: 200
    },
    abilities: [
      {
        name: 'Rasengan',
        description: 'A powerful spinning ball of chakra',
        type: 'attack',
        damage: 200,
        chakraCost: 50,
        cooldown: 3
      },
      {
        name: 'Shadow Clone Jutsu',
        description: 'Creates shadow clones for combat',
        type: 'support',
        damage: 0,
        chakraCost: 30,
        cooldown: 2
      }
    ],
    description: 'The hyperactive ninja who dreams of becoming Hokage. Early academy version with basic jutsu.'
  },

  {
    id: 'NC002',
    name: 'Sasuke Uchiha',
    anime: 'Naruto',
    rarity: 'COMMON',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/sasuke-genin.png',
    baseStats: {
      health: 1100,
      attack: 180,
      defense: 90,
      speed: 160,
      chakra: 180
    },
    abilities: [
      {
        name: 'Chidori',
        description: 'A lightning-based attack that pierces through defenses',
        type: 'attack',
        damage: 220,
        chakraCost: 60,
        cooldown: 4
      },
      {
        name: 'Sharingan',
        description: 'Allows prediction of opponent\'s movements',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'The brooding Uchiha prodigy. Chunin Exams version with developing Sharingan abilities.'
  },

  {
    id: 'NC003',
    name: 'Sakura Haruno',
    anime: 'Naruto',
    rarity: 'COMMON',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/sakura-part1.png',
    baseStats: {
      health: 1300,
      attack: 120,
      defense: 140,
      speed: 110,
      chakra: 160
    },
    abilities: [
      {
        name: 'Strength of a Hundred Seal',
        description: 'Massive strength boost for powerful punches',
        type: 'attack',
        damage: 180,
        chakraCost: 40,
        cooldown: 3
      },
      {
        name: 'Medical Jutsu',
        description: 'Basic healing abilities',
        type: 'support',
        damage: 0,
        chakraCost: 35,
        cooldown: 2
      }
    ],
    description: 'The intelligent kunoichi of Team 7. Part 1 version focused on strength and medical skills.'
  },

  {
    id: 'NC004',
    name: 'Konohamaru',
    anime: 'Naruto',
    rarity: 'COMMON',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/konohamaru.png',
    baseStats: {
      health: 1000,
      attack: 100,
      defense: 80,
      speed: 130,
      chakra: 140
    },
    abilities: [
      {
        name: 'Rasengan',
        description: 'Miniature version of Naruto\'s signature jutsu',
        type: 'attack',
        damage: 150,
        chakraCost: 45,
        cooldown: 3
      },
      {
        name: 'Transformation Jutsu',
        description: 'Basic transformation technique',
        type: 'support',
        damage: 0,
        chakraCost: 20,
        cooldown: 1
      }
    ],
    description: 'Naruto\'s enthusiastic apprentice. Academy student with potential to become Hokage.'
  },

  {
    id: 'NC005',
    name: 'Moegi',
    anime: 'Naruto',
    rarity: 'COMMON',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/moegi.png',
    baseStats: {
      health: 1050,
      attack: 95,
      defense: 85,
      speed: 125,
      chakra: 135
    },
    abilities: [
      {
        name: 'Bushin',
        description: 'Creates wooden clones for distraction',
        type: 'support',
        damage: 0,
        chakraCost: 25,
        cooldown: 2
      },
      {
        name: 'Wood Release',
        description: 'Basic wood manipulation techniques',
        type: 'attack',
        damage: 130,
        chakraCost: 35,
        cooldown: 3
      }
    ],
    description: 'One of the academy students. Specializes in wood release techniques.'
  },

  {
    id: 'NC006',
    name: 'Udon',
    anime: 'Naruto',
    rarity: 'COMMON',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/udon.png',
    baseStats: {
      health: 1150,
      attack: 85,
      defense: 95,
      speed: 105,
      chakra: 125
    },
    abilities: [
      {
        name: 'Intelligence Gathering',
        description: 'Gathers information about enemies',
        type: 'support',
        damage: 0,
        chakraCost: 15,
        cooldown: 1
      },
      {
        name: 'Tactical Analysis',
        description: 'Analyzes opponent\'s weaknesses',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'The intelligent member of the academy trio. Focuses on strategy and analysis.'
  },

  {
    id: 'NC007',
    name: 'Mizuki',
    anime: 'Naruto',
    rarity: 'COMMON',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/mizuki.png',
    baseStats: {
      health: 1250,
      attack: 140,
      defense: 110,
      speed: 120,
      chakra: 150
    },
    abilities: [
      {
        name: 'Forbidden Scroll Theft',
        description: 'Steals enemy abilities temporarily',
        type: 'support',
        damage: 0,
        chakraCost: 50,
        cooldown: 4
      },
      {
        name: 'Wind Release',
        description: 'Wind-based attack techniques',
        type: 'attack',
        damage: 160,
        chakraCost: 40,
        cooldown: 3
      }
    ],
    description: 'The traitorous academy instructor. Possesses forbidden jutsu knowledge.'
  }
];

module.exports = commonCharacters;
