const dimensionalCharacters = [
  {
    id: 'ND001',
    name: 'Kaguya Otsutsuki',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/kaguya.png',
    baseStats: {
      health: 3500,
      attack: 400,
      defense: 300,
      speed: 320,
      chakra: 550
    },
    abilities: [
      {
        name: 'Byakugan',
        description: 'All-seeing white eyes with 360-degree vision',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      },
      {
        name: 'All-Killing Ash Bones',
        description: 'Pierces enemies with dimensional ash bones',
        type: 'attack',
        damage: 480,
        chakraCost: 160,
        cooldown: 6
      }
    ],
    description: 'The progenitor of chakra. Mother of all chakra users with god-like powers.'
  },

  {
    id: 'ND002',
    name: 'Hagoromo Otsutsuki',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/hagoromo.png',
    baseStats: {
      health: 3200,
      attack: 380,
      defense: 280,
      speed: 300,
      chakra: 600
    },
    abilities: [
      {
        name: 'Rinnegan',
        description: 'Ultimate eye with all chakra natures and abilities',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      },
      {
        name: 'Truth-Seeking Orbs',
        description: 'Creates orbs that can destroy anything',
        type: 'attack',
        damage: 500,
        chakraCost: 180,
        cooldown: 7
      }
    ],
    description: 'The Sage of Six Paths. Creator of ninjutsu and the founder of ninja world.'
  },

  {
    id: 'ND003',
    name: 'Hamura Otsutsuki',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/hamura.png',
    baseStats: {
      health: 3100,
      attack: 370,
      defense: 290,
      speed: 310,
      chakra: 580
    },
    abilities: [
      {
        name: 'Tenseigan',
        description: 'Evolved Byakugan with gravitational powers',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      },
      {
        name: 'Tengai Shinsei',
        description: 'Creates miniature moon with gravitational pull',
        type: 'control',
        damage: 450,
        chakraCost: 170,
        cooldown: 8
      }
    ],
    description: 'Hagoromo\'s twin brother. Master of gravitational techniques.'
  },

  {
    id: 'ND004',
    name: 'Naruto Uzumaki (Six Paths Sage Mode)',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/naruto-six-paths.png',
    baseStats: {
      health: 3300,
      attack: 390,
      defense: 270,
      speed: 340,
      chakra: 520
    },
    abilities: [
      {
        name: 'Six Paths Sage Mode',
        description: 'Ultimate sage transformation with truth-seeking orbs',
        type: 'transformation',
        damage: 0,
        chakraCost: 200,
        cooldown: 10
      },
      {
        name: 'Wind Release: Rasenshuriken',
        description: 'Wind-infused rasenshuriken with planetary destruction',
        type: 'attack',
        damage: 520,
        chakraCost: 150,
        cooldown: 8
      }
    ],
    description: 'Naruto as the Seventh Hokage. Master of all chakra natures and sage techniques.'
  },

  {
    id: 'ND005',
    name: 'Sasuke Uchiha (Rinnegan + Eternal Mangekyo)',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/sasuke-rinnegan-ems.png',
    baseStats: {
      health: 3150,
      attack: 385,
      defense: 260,
      speed: 330,
      chakra: 510
    },
    abilities: [
      {
        name: 'Rinnegan + EMS',
        description: 'Ultimate combination of both legendary eyes',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      },
      {
        name: 'Indra\'s Arrow',
        description: 'Infinite lightning arrow with dimensional power',
        type: 'attack',
        damage: 490,
        chakraCost: 165,
        cooldown: 7
      }
    ],
    description: 'Sasuke with both Rinnegan and Eternal Mangekyo. The ultimate Uchiha.'
  },

  {
    id: 'ND006',
    name: 'Madara Uchiha (Ten Tails Jinchuriki)',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/madara-ten-tails.png',
    baseStats: {
      health: 3600,
      attack: 410,
      defense: 310,
      speed: 290,
      chakra: 570
    },
    abilities: [
      {
        name: 'Rinnegan',
        description: 'Controls life, death, and dimensions',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      },
      {
        name: 'Infinite Tsukuyomi',
        description: 'Traps the world in eternal illusion',
        type: 'control',
        damage: 550,
        chakraCost: 200,
        cooldown: 10
      }
    ],
    description: 'Madara controlling the Ten Tails. The most powerful being in history.'
  },

  {
    id: 'ND007',
    name: 'Obito Uchiha (Ten Tails Jinchuriki)',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/5pjx7qbpc/naruto/characters/obito-ten-tails.png',
    baseStats: {
      health: 3400,
      attack: 395,
      defense: 280,
      speed: 310,
      chakra: 540
    },
    abilities: [
      {
        name: 'Kamui',
        description: 'Ultimate space-time manipulation',
        type: 'control',
        damage: 460,
        chakraCost: 140,
        cooldown: 6
      },
      {
        name: 'Gunbai',
        description: 'Legendary fan that controls dimensions',
        type: 'control',
        damage: 420,
        chakraCost: 130,
        cooldown: 5
      }
    ],
    description: 'Obito as the Ten Tails Jinchuriki. Master of space-time and illusions.'
  }
];

module.exports = dimensionalCharacters;
