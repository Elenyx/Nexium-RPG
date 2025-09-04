const legendaryCharacters = [
  {
    id: 'NL001',
    name: 'Jiraiya',
    anime: 'Naruto',
    rarity: 'LEGENDARY',
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Jiraiya.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Jiraiya.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Jiraiya.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Jiraiya.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Jiraiya.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Jiraiya.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Jiraiya.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Tsunade.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Tsunade.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Tsunade.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Tsunade.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Tsunade.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Tsunade.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Tsunade.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Orochimaru.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Orochimaru.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Orochimaru.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Orochimaru.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Orochimaru.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Orochimaru.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Orochimaru.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Gaara.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Gaara.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Gaara.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Gaara.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Gaara.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Gaara.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Gaara.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/FourthRaikage.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/FourthRaikage.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/FourthRaikage.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/FourthRaikage.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/FourthRaikage.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/FourthRaikage.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/FourthRaikage.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/ThirdRaikage.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/ThirdRaikage.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/ThirdRaikage.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/ThirdRaikage.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/ThirdRaikage.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/ThirdRaikage.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/ThirdRaikage.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Onoki.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Onoki.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Onoki.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Onoki.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Onoki.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Onoki.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Onoki.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Mei.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Mei.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Mei.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Mei.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Mei.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Mei.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Mei.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Kisame.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Kisame.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Kisame.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Kisame.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Kisame.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Kisame.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Kisame.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Deidara.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Deidara.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Deidara.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Deidara.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Deidara.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Deidara.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Deidara.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Sasori.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Sasori.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Sasori.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Sasori.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Sasori.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Sasori.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Sasori.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Konan.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Konan.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Konan.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Konan.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Konan.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Konan.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Konan.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Zabuza.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Zabuza.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Zabuza.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Zabuza.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Zabuza.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Zabuza.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Zabuza.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Hiruzen.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Hiruzen.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Hiruzen.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Hiruzen.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Hiruzen.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Hiruzen.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Hiruzen.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Sasuke-HeavenlyHand.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Sasuke-HeavenlyHand.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Sasuke-HeavenlyHand.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Sasuke-HeavenlyHand.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Sasuke-HeavenlyHand.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Sasuke-HeavenlyHand.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Sasuke-HeavenlyHand.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Susanoo-Skeletal.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Susanoo-Skeletal.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Susanoo-Skeletal.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Susanoo-Skeletal.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Susanoo-Skeletal.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Susanoo-Skeletal.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Susanoo-Skeletal.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Kimimaro-Shikotsumyaku.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Kimimaro-Shikotsumyaku.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Kimimaro-Shikotsumyaku.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Kimimaro-Shikotsumyaku.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Kimimaro-Shikotsumyaku.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Kimimaro-Shikotsumyaku.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Kimimaro-Shikotsumyaku.png'
    },
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
    image: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Naruto-FourTails.png',
    imageUrls: {
      COMMON: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Naruto-FourTails.png',
      RARE: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Naruto-FourTails.png',
      EPIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Naruto-FourTails.png',
      LEGENDARY: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/LEGENDARY/Naruto-FourTails.png',
      MYTHIC: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/MYTHIC/Naruto-FourTails.png',
      DIMENSIONAL: 'https://ik.imagekit.io/nexiumrpg/Characters/Naruto/DIMENSIONAL/Naruto-FourTails.png'
    },
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
