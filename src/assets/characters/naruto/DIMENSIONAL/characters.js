const dimensionalCharacters = [
  {
    id: 'ND001',
    name: 'Kaguya Otsutsuki',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND001.png',
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
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND002.png',
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
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND003.png',
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
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND004.png',
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
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND005.png',
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
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND006.png',
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
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND007.png',
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
  },

  {
    id: 'ND008',
    name: 'Naruto Uzumaki - Nine Tails Sage Mode',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND008.png',
    baseStats: {
      health: 3600,
      attack: 410,
      defense: 290,
      speed: 350,
      chakra: 580
    },
    abilities: [
      {
        name: 'Truth-Seeking Orb Barrage',
        description: 'Multiple truth-seeking orbs for ultimate destruction',
        type: 'attack',
        damage: 520,
        chakraCost: 180,
        cooldown: 8
      },
      {
        name: 'Sage Regeneration',
        description: 'God-like regeneration from sage chakra',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Naruto combining nine-tails chakra with sage mode. God-like power and regeneration.'
  },

  {
    id: 'ND009',
    name: 'Naruto Uzumaki - Tailed Beast Mode',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND009.png',
    baseStats: {
      health: 3800,
      attack: 420,
      defense: 310,
      speed: 330,
      chakra: 600
    },
    abilities: [
      {
        name: 'Tailed Beast Bomb',
        description: 'Massive chakra sphere of destruction',
        type: 'attack',
        damage: 550,
        chakraCost: 200,
        cooldown: 10
      },
      {
        name: 'Infinite Chakra',
        description: 'Endless chakra reserves from tailed beast',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Naruto in full tailed beast form. Unparalleled destructive force and chakra output.'
  },

  {
    id: 'ND010',
    name: 'Naruto Uzumaki - Sage Mode (Mastered)',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND010.png',
    baseStats: {
      health: 3550,
      attack: 395,
      defense: 275,
      speed: 360,
      chakra: 570
    },
    abilities: [
      {
        name: 'Sage Art: Super Rasenshuriken',
        description: 'Ultimate sage-enhanced rasenshuriken',
        type: 'attack',
        damage: 500,
        chakraCost: 170,
        cooldown: 8
      },
      {
        name: 'Perfect Sage Sensing',
        description: 'Ultimate perception of all things',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Naruto\'s perfected sage mode. Ultimate sensing and natural energy manipulation.'
  },

  {
    id: 'ND011',
    name: 'Naruto Uzumaki - Kurama Sage Mode',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND011.png',
    baseStats: {
      health: 3650,
      attack: 405,
      defense: 285,
      speed: 345,
      chakra: 590
    },
    abilities: [
      {
        name: 'Kurama Sage Bomb',
        description: 'Sage-enhanced tailed beast bomb',
        type: 'attack',
        damage: 530,
        chakraCost: 190,
        cooldown: 9
      },
      {
        name: 'Wisdom of the Sage',
        description: 'Enhanced intelligence and strategy',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Naruto in Kurama chakra mode with sage enhancements. Balanced power and wisdom.'
  },

  {
    id: 'ND012',
    name: 'Naruto Uzumaki - Ashura Mode',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND012.png',
    baseStats: {
      health: 3700,
      attack: 415,
      defense: 295,
      speed: 355,
      chakra: 600
    },
    abilities: [
      {
        name: 'Ashura\'s Truth-Seeking Orbs',
        description: 'God-like truth-seeking orb manipulation',
        type: 'attack',
        damage: 540,
        chakraCost: 195,
        cooldown: 9
      },
      {
        name: 'Divine Chakra Control',
        description: 'Perfect control over all chakra natures',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Naruto wielding Hagoromo\'s Ashura power. God-like abilities and chakra control.'
  },

  {
    id: 'ND013',
    name: 'Naruto Uzumaki - Baryon Mode',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND013.png',
    baseStats: {
      health: 3900,
      attack: 430,
      defense: 320,
      speed: 370,
      chakra: 650
    },
    abilities: [
      {
        name: 'Baryon Rasenshuriken',
        description: 'Reality-warping rasenshuriken with baryon energy',
        type: 'attack',
        damage: 580,
        chakraCost: 220,
        cooldown: 12
      },
      {
        name: 'Infinite Energy',
        description: 'Endless energy manipulation beyond limits',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Naruto\'s ultimate Baryon Mode from Boruto. Reality-warping energy and infinite chakra.'
  },

  {
    id: 'ND014',
    name: 'Madara - Divine Genesis: World of Trees',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND014.png',
    baseStats: {
      health: 3800,
      attack: 425,
      defense: 315,
      speed: 335,
      chakra: 620
    },
    abilities: [
      {
        name: 'Infinite Forest',
        description: 'Creates endless trees to overwhelm enemies',
        type: 'control',
        damage: 450,
        chakraCost: 180,
        cooldown: 8
      },
      {
        name: 'Life Creation',
        description: 'Generates life forms and vegetation',
        type: 'support',
        damage: 0,
        chakraCost: 150,
        cooldown: 7
      }
    ],
    description: 'Madara\'s reality-warping creation technique. Generates infinite trees and life.'
  },

  {
    id: 'ND015',
    name: 'Hagoromo\'s Chakra Transfer Jutsu',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND015.png',
    baseStats: {
      health: 3750,
      attack: 410,
      defense: 300,
      speed: 340,
      chakra: 610
    },
    abilities: [
      {
        name: 'Chakra Infusion',
        description: 'Grants immense power to allies through chakra transfer',
        type: 'support',
        damage: 0,
        chakraCost: 200,
        cooldown: 10
      },
      {
        name: 'Sage Power Boost',
        description: 'Enhances all abilities with sage chakra',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Sage of Six Paths\' chakra infusion technique. Grants immense power to allies.'
  },

  {
    id: 'ND016',
    name: 'Hagoromo\'s Complete Body — Susanoo',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND016.png',
    baseStats: {
      health: 3850,
      attack: 435,
      defense: 325,
      speed: 345,
      chakra: 630
    },
    abilities: [
      {
        name: 'Complete Susanoo Strike',
        description: 'God-like attack with ultimate chakra construct',
        type: 'attack',
        damage: 550,
        chakraCost: 210,
        cooldown: 10
      },
      {
        name: 'Infinite Chakra Armor',
        description: 'Unbreakable defense with infinite chakra',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Hagoromo\'s ultimate Susanoo form. God-like chakra construct with infinite power.'
  },

  {
    id: 'ND017',
    name: 'Sasuke Senjutsu Susanoo',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND017.png',
    baseStats: {
      health: 3800,
      attack: 420,
      defense: 310,
      speed: 350,
      chakra: 615
    },
    abilities: [
      {
        name: 'Senjutsu Arrow Barrage',
        description: 'Arrows enhanced with natural energy',
        type: 'attack',
        damage: 480,
        chakraCost: 170,
        cooldown: 7
      },
      {
        name: 'Perfect Balance',
        description: 'Ultimate harmony of offense and defense',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Sasuke\'s Susanoo enhanced with senjutsu. Perfect balance of offense and defense.'
  },

  {
    id: 'ND018',
    name: 'Susanoo Complete Body (perfect Susanoo)',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND018.png',
    baseStats: {
      health: 3850,
      attack: 430,
      defense: 320,
      speed: 340,
      chakra: 625
    },
    abilities: [
      {
        name: 'Perfect Susanoo Sword',
        description: 'Ultimate chakra sword with perfect form',
        type: 'attack',
        damage: 520,
        chakraCost: 190,
        cooldown: 8
      },
      {
        name: 'Absolute Defense',
        description: 'Perfect chakra armor that blocks all attacks',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Ultimate Susanoo manifestation. Perfect chakra armor and weaponry.'
  },

  {
    id: 'ND019',
    name: 'Chibaku Tensei',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND019.png',
    baseStats: {
      health: 3750,
      attack: 415,
      defense: 305,
      speed: 325,
      chakra: 605
    },
    abilities: [
      {
        name: 'Planet Creation',
        description: 'Creates miniature planets to crush enemies',
        type: 'control',
        damage: 500,
        chakraCost: 200,
        cooldown: 12
      },
      {
        name: 'Gravitational Pull',
        description: 'Pulls enemies into planetary orbit',
        type: 'control',
        damage: 350,
        chakraCost: 120,
        cooldown: 6
      }
    ],
    description: 'Chibaku Tensei technique. Creates miniature planets to trap and crush enemies.'
  },

  {
    id: 'ND020',
    name: 'Pain - The Almighty Push and Pull',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND020.png',
    baseStats: {
      health: 3800,
      attack: 425,
      defense: 315,
      speed: 335,
      chakra: 620
    },
    abilities: [
      {
        name: 'Universal Push',
        description: 'Repels everything with gravitational force',
        type: 'control',
        damage: 460,
        chakraCost: 160,
        cooldown: 7
      },
      {
        name: 'Universal Pull',
        description: 'Attracts everything with gravitational force',
        type: 'control',
        damage: 460,
        chakraCost: 160,
        cooldown: 7
      }
    ],
    description: 'Pain\'s gravitational control via Rinnegan. Manipulates attraction and repulsion.'
  },

  {
    id: 'ND021',
    name: 'Nagato - The Gedo Art of Rinne Rebirth',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND021.png',
    baseStats: {
      health: 3780,
      attack: 420,
      defense: 310,
      speed: 330,
      chakra: 615
    },
    abilities: [
      {
        name: 'Gedo Chains',
        description: 'Summons chains for rebirth and control',
        type: 'control',
        damage: 470,
        chakraCost: 175,
        cooldown: 8
      },
      {
        name: 'Rinne Rebirth',
        description: 'Ultimate resurrection technique',
        type: 'support',
        damage: 0,
        chakraCost: 250,
        cooldown: 15
      }
    ],
    description: 'Nagato\'s ultimate Rinnegan technique. Rebirth and resurrection through Gedo chains.'
  },

  {
    id: 'ND022',
    name: 'The Six Paths\' Yang Power',
    anime: 'Naruto',
    rarity: 'DIMENSIONAL',
    image: 'https://ik.imagekit.io/NexiumRPG/Characters/ND022.png',
    baseStats: {
      health: 3900,
      attack: 440,
      defense: 330,
      speed: 350,
      chakra: 640
    },
    abilities: [
      {
        name: 'Life Force Manipulation',
        description: 'Controls life and death with yang power',
        type: 'control',
        damage: 490,
        chakraCost: 185,
        cooldown: 9
      },
      {
        name: 'Immortal Body',
        description: 'Grants immortality and regeneration',
        type: 'passive',
        damage: 0,
        chakraCost: 0,
        cooldown: 0
      }
    ],
    description: 'Hagoromo\'s life-force power. Grants immortality and chakra manipulation mastery.'
  }
];

module.exports = dimensionalCharacters;
