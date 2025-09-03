/**
 * Naruto Dimensional Characters (DIMENSIONAL tier)
 * ID Format: NU049, NU050, etc.
 */

const dimensionalCharacters = [
    {
        id: 'NU049',
        name: 'Madara Uchiha (Rinnegan)',
        anime: 'Naruto',
        rarity: 'DIMENSIONAL',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 95,
            defense: 92,
            speed: 88,
            health: 110
        },
        abilities: ['Rinnegan', 'Limbo', 'Wood Release', 'Susanoo'],
        description: 'Madara Uchiha with his awakened Rinnegan. The legendary Uchiha who sought to create a world of peace through infinite Tsukuyomi.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/madara-uchiha-rinnegan.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/madara-uchiha-rinnegan-thumb.jpg',
        element: 'None',
        class: 'Uchiha',
        region: 'Hidden Leaf Village',
        quote: 'The world is filled with hatred and despair. I will create a new world.'
    },
    {
        id: 'NU050',
        name: 'Kaguya Otsutsuki',
        anime: 'Naruto',
        rarity: 'DIMENSIONAL',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 94,
            defense: 90,
            speed: 91,
            health: 108
        },
        abilities: ['Byakugan', 'All-Killing Ash Bones', 'Rinne Sharingan', 'Truth-Seeking Orbs'],
        description: 'The progenitor of chakra and the Otsutsuki clan. The Rabbit Goddess who brought chakra to the world and sought to reclaim it.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/kaguya-otsutsuki.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/kaguya-otsutsuki-thumb.jpg',
        element: 'None',
        class: 'Otsutsuki',
        region: 'Otsutsuki Clan',
        quote: 'I am the source of all chakra. I will take it back.'
    },
    {
        id: 'NU051',
        name: 'Hagoromo Otsutsuki (Sage of Six Paths)',
        anime: 'Naruto',
        rarity: 'DIMENSIONAL',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 93,
            defense: 88,
            speed: 86,
            health: 106
        },
        abilities: ['Rinnegan', 'Six Paths', 'Creation of All Things', 'Truth-Seeking Orbs'],
        description: 'The legendary Sage of Six Paths who founded ninjutsu. The son of Kaguya who brought peace to the warring states era.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/hagoromo-otsutsuki.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/hagoromo-otsutsuki-thumb.jpg',
        element: 'None',
        class: 'Sage',
        region: 'Otsutsuki Clan',
        quote: 'I will create a world where everyone can understand each other.'
    },
    {
        id: 'NU052',
        name: 'Naruto Uzumaki (Six Paths Sage Mode)',
        anime: 'Naruto',
        rarity: 'DIMENSIONAL',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 96,
            defense: 89,
            speed: 94,
            health: 112
        },
        abilities: ['Six Paths Sage Mode', 'Truth-Seeking Orbs', 'Rinnegan', 'Kurama Control'],
        description: 'Naruto in his ultimate form, achieving Six Paths Sage Mode. The savior who brings true peace to the ninja world.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/naruto-uzumaki-six-paths.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/naruto-uzumaki-six-paths-thumb.jpg',
        element: 'None',
        class: 'Sage',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not gonna run away, I never go back on my word! That\'s my nindo: my ninja way!'
    },
    {
        id: 'NU053',
        name: 'Sasuke Uchiha (Rinnegan)',
        anime: 'Naruto',
        rarity: 'DIMENSIONAL',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 94,
            defense: 87,
            speed: 92,
            health: 109
        },
        abilities: ['Rinnegan', 'Indra\'s Arrow', 'Susanoo', 'Chibaku Tensei'],
        description: 'Sasuke with his awakened Rinnegan. The Last Uchiha who transcends the cycle of hatred to protect the world.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/sasuke-uchiha-rinnegan.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/sasuke-uchiha-rinnegan-thumb.jpg',
        element: 'None',
        class: 'Uchiha',
        region: 'Hidden Leaf Village',
        quote: 'I will protect the world that Naruto believes in.'
    },
    {
        id: 'NU054',
        name: 'Obito Uchiha (Masked Man)',
        anime: 'Naruto',
        rarity: 'DIMENSIONAL',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 92,
            defense: 85,
            speed: 90,
            health: 107
        },
        abilities: ['Kamui', 'Rinnegan', 'Gunbai', 'Wood Release'],
        description: 'Obito Uchiha as the Masked Man, with full control over his powers. The man who sought to create a world without lies.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/obito-uchiha-masked.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/obito-uchiha-masked-thumb.jpg',
        element: 'None',
        class: 'Uchiha',
        region: 'Hidden Leaf Village',
        quote: 'The world is built on the sacrifices of others.'
    },
    {
        id: 'NU055',
        name: 'Boruto Uzumaki',
        anime: 'Naruto',
        rarity: 'DIMENSIONAL',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 91,
            defense: 86,
            speed: 95,
            health: 105
        },
        abilities: ['Jogan', 'Rasengan', 'Shadow Clone', 'Karma'],
        description: 'Boruto Uzumaki, son of Naruto and Hinata. The next generation ninja with the mysterious Jogan eye.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/boruto-uzumaki.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/boruto-uzumaki-thumb.jpg',
        element: 'None',
        class: 'Ninja',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not my dad!'
    }
];

module.exports = dimensionalCharacters;
