/**
 * Naruto Kage Characters (LEGENDARY tier)
 * ID Format: NU026, NU027, etc.
 */

const kageCharacters = [
    {
        id: 'NU026',
        name: 'Naruto Uzumaki (Sage Mode)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 89,
            defense: 84,
            speed: 87,
            health: 95
        },
        abilities: ['Sage Mode', 'Rasengan', 'Nine-Tails Chakra', 'Shadow Clone'],
        description: 'Naruto in his Sage Mode form, having mastered the power of nature energy. The hero who brings peace to the ninja world.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/naruto-uzumaki-sage.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/naruto-uzumaki-sage-thumb.jpg',
        element: 'Wind',
        class: 'Sage',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not gonna run away, I never go back on my word! That\'s my nindo: my ninja way!'
    },
    {
        id: 'NU027',
        name: 'Sasuke Uchiha (Eternal Mangekyo)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 91,
            defense: 86,
            speed: 92,
            health: 89
        },
        abilities: ['Eternal Mangekyo Sharingan', 'Chidori', 'Susanoo', 'Rinnegan'],
        description: 'Sasuke with the Eternal Mangekyo Sharingan, having awakened the ultimate Uchiha power. A rival turned ally.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/sasuke-uchiha-eternal.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/sasuke-uchiha-eternal-thumb.jpg',
        element: 'Lightning',
        class: 'Uchiha',
        region: 'Hidden Leaf Village',
        quote: 'I\'m an avenger.'
    },
    {
        id: 'NU028',
        name: 'Itachi Uchiha (Full Power)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 88,
            defense: 82,
            speed: 90,
            health: 87
        },
        abilities: ['Mangekyo Sharingan', 'Tsukuyomi', 'Amaterasu', 'Susanoo'],
        description: 'The legendary prodigy of the Uchiha clan. A master of genjutsu and the older brother of Sasuke.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/itachi-uchiha-full.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/itachi-uchiha-full-thumb.jpg',
        element: 'Fire',
        class: 'Genjutsu Master',
        region: 'Hidden Leaf Village',
        quote: 'People live their lives bound by what they accept as correct and true. That\'s how they define "reality".'
    },
    {
        id: 'NU029',
        name: 'Gaara (Kazekage)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 85,
            defense: 91,
            speed: 83,
            health: 93
        },
        abilities: ['Sand Manipulation', 'Shukaku', 'Desert Coffin', 'Sand Tsunami'],
        description: 'The Fifth Kazekage and former host of the One-Tailed Beast. Master of sand manipulation and a symbol of peace.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/gaara-kazekage.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/gaara-kazekage-thumb.jpg',
        element: 'None',
        class: 'Kazekage',
        region: 'Hidden Sand Village',
        quote: 'I\'m not the monster I used to be.'
    },
    {
        id: 'NU030',
        name: 'Tsunade (Fifth Hokage)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 87,
            defense: 89,
            speed: 85,
            health: 97
        },
        abilities: ['Medical Ninjutsu', 'Strength of a Hundred Seal', 'Creation Rebirth', 'Slug Summoning'],
        description: 'The legendary Sannin and Fifth Hokage. Master of medical ninjutsu and incredible physical strength.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/tsunade-hokage.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/tsunade-hokage-thumb.jpg',
        element: 'None',
        class: 'Medical Ninja',
        region: 'Hidden Leaf Village',
        quote: 'A medical ninja\'s duty is to heal, but sometimes... you have to fight.'
    },
    {
        id: 'NU031',
        name: 'Jiraiya (Sage Mode)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 86,
            defense: 84,
            speed: 88,
            health: 92
        },
        abilities: ['Sage Mode', 'Rasengan', 'Toad Summoning', 'Sage Art: Goemon'],
        description: 'The legendary Sannin and Naruto\'s teacher. Master of sage techniques and summoning jutsu.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/jiraiya-sage.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/jiraiya-sage-thumb.jpg',
        element: 'None',
        class: 'Sage',
        region: 'Hidden Leaf Village',
        quote: 'A place where someone still thinks about you is a place you can call home.'
    },
    {
        id: 'NU032',
        name: 'Orochimaru (Immortal)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 84,
            defense: 83,
            speed: 86,
            health: 90
        },
        abilities: ['Immortality', 'Regeneration', 'Snake Summoning', 'Forbidden Jutsu'],
        description: 'The legendary Sannin who seeks immortality through forbidden techniques. A master of science and experimentation.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/orochimaru-immortal.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/orochimaru-immortal-thumb.jpg',
        element: 'None',
        class: 'Scientist',
        region: 'Otogakure',
        quote: 'The more you know, the more you realize you don\'t know.'
    },
    {
        id: 'NU033',
        name: 'Killer Bee (Eight-Tails)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 88,
            defense: 87,
            speed: 89,
            health: 94
        },
        abilities: ['Eight-Tails Chakra', 'Lariat', 'Ink Creation', 'Version 2'],
        description: 'The host of the Eight-Tails and brother of the Fourth Raikage. A master rapper and powerful taijutsu user.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/killer-bee-eight-tails.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/killer-bee-eight-tails-thumb.jpg',
        element: 'None',
        class: 'Jinjuriki',
        region: 'Hidden Cloud Village',
        quote: 'Believe it! I\'m the coolest rapper in the world!'
    },
    {
        id: 'NU034',
        name: 'Minato Namikaze (Fourth Hokage)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 90,
            defense: 85,
            speed: 95,
            health: 88
        },
        abilities: ['Flying Thunder God', 'Rasengan', 'Sage Mode', 'Space-Time Ninjutsu'],
        description: 'The legendary Fourth Hokage and father of Naruto. Master of space-time ninjutsu and incredible speed.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/minato-namikaze-hokage.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/minato-namikaze-hokage-thumb.jpg',
        element: 'None',
        class: 'Space-Time Ninja',
        region: 'Hidden Leaf Village',
        quote: 'I\'ll always be watching over you, Naruto.'
    },
    {
        id: 'NU035',
        name: 'Madara Uchiha (Rinnegan)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 93,
            defense: 90,
            speed: 91,
            health: 96
        },
        abilities: ['Rinnegan', 'Eternal Mangekyo Sharingan', 'Susanoo', 'Wood Release'],
        description: 'The legendary founder of the Uchiha clan and master of all Sharingan abilities. A god-like figure in the ninja world.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/madara-uchiha-rinnegan.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/madara-uchiha-rinnegan-thumb.jpg',
        element: 'None',
        class: 'Uchiha Patriarch',
        region: 'Hidden Leaf Village',
        quote: 'The world... is not beautiful; therefore, it is.'
    },
    {
        id: 'NU036',
        name: 'Hashirama Senju (First Hokage)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 92,
            defense: 94,
            speed: 87,
            health: 98
        },
        abilities: ['Wood Release', 'Sage Mode', 'Creation of All Things', 'True Several Thousand Hands'],
        description: 'The legendary First Hokage and founder of the Hidden Leaf Village. Master of Wood Release and incredible vitality.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/hashirama-senju-hokage.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/hashirama-senju-hokage-thumb.jpg',
        element: 'Wood',
        class: 'Sage',
        region: 'Hidden Leaf Village',
        quote: 'Peace... is not the absence of conflict, but the ability to cope with it.'
    },
    {
        id: 'NU037',
        name: 'Kaguya Otsutsuki',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 95,
            defense: 92,
            speed: 93,
            health: 97
        },
        abilities: ['Byakugan', 'All-Creating', 'All-Killing', 'Rinne Sharingan'],
        description: 'The progenitor of chakra and mother of all ninjutsu. A god-like being from another dimension.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/kaguya-otsutsuki.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/kaguya-otsutsuki-thumb.jpg',
        element: 'None',
        class: 'Otsutsuki',
        region: 'Otsutsuki Clan',
        quote: 'I am the beginning... and the end.'
    },
    {
        id: 'NU038',
        name: 'Pain (Rikudo)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 89,
            defense: 88,
            speed: 90,
            health: 91
        },
        abilities: ['Rinnegan', 'Six Paths', 'Universal Pull', 'Almighty Push'],
        description: 'Nagato in his Pain form, wielding the power of the Six Paths. A god-like figure seeking world peace through pain.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/pain-rikudo.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/pain-rikudo-thumb.jpg',
        element: 'None',
        class: 'Rikudo',
        region: 'Amegakure',
        quote: 'Those who do not understand true pain can never understand true peace.'
    },
    {
        id: 'NU039',
        name: 'Hagoromo Otsutsuki (Sage of Six Paths)',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 94,
            defense: 93,
            speed: 92,
            health: 99
        },
        abilities: ['Rinnegan', 'Six Paths', 'Truth-Seeking Orbs', 'Creation of All Things'],
        description: 'The legendary Sage of Six Paths who brought chakra to the world. The father of all ninjutsu and progenitor of the ninja clans.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/hagoromo-otsutsuki-sage.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/hagoromo-otsutsuki-sage-thumb.jpg',
        element: 'None',
        class: 'Sage of Six Paths',
        region: 'Otsutsuki Clan',
        quote: 'Love is the most powerful force in the world.'
    }
];

module.exports = kageCharacters;
