/**
 * Naruto Jonin Characters (EPIC tier)
 * ID Format: NU015, NU016, etc.
 */

const joninCharacters = [
    {
        id: 'NU015',
        name: 'Kakashi Hatake (Early Shippuden)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 78,
            defense: 73,
            speed: 81,
            health: 88
        },
        abilities: ['Chidori', 'Sharingan', 'Summoning: Dog'],
        description: 'The legendary Copy Ninja and Team 7\'s jonin leader. Master of over a thousand jutsu and wielder of the Sharingan.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/kakashi-hatake-early.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/kakashi-hatake-early-thumb.jpg',
        element: 'Lightning',
        class: 'Jonin',
        region: 'Hidden Leaf Village',
        quote: 'I\'m Kakashi Hatake. Things I like and things I hate... I don\'t feel like telling you that.'
    },
    {
        id: 'NU016',
        name: 'Might Guy (Pre-8th Gate)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 82,
            defense: 79,
            speed: 89,
            health: 91
        },
        abilities: ['Eight Gates', 'Strong Fist', 'Leaf Hurricane'],
        description: 'The taijutsu master and rival to Kakashi. Known for his incredible speed and strength, pushing his body to its limits.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/might-guy-pre-gate.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/might-guy-pre-gate-thumb.jpg',
        element: 'None',
        class: 'Taijutsu Master',
        region: 'Hidden Leaf Village',
        quote: 'I\'ll show you the power of hard work!'
    },
    {
        id: 'NU017',
        name: 'Shikamaru Nara (Jonin Strategist)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 75,
            defense: 71,
            speed: 77,
            health: 85
        },
        abilities: ['Shadow Possession', 'Strategic Mind', 'Shadow Neck Bind'],
        description: 'The brilliant strategist of Team 10, promoted to Jonin. His tactical genius makes him invaluable in any battle.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/shikamaru-nara-jonin.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/shikamaru-nara-jonin-thumb.jpg',
        element: 'None',
        class: 'Strategist',
        region: 'Hidden Leaf Village',
        quote: 'What a drag...'
    },
    {
        id: 'NU018',
        name: 'Neji Hyuga (Jonin Level)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 79,
            defense: 77,
            speed: 83,
            health: 87
        },
        abilities: ['Byakugan', 'Gentle Fist', 'Eight Trigrams Palm'],
        description: 'The prodigy of the Hyuga clan, promoted to Jonin. Master of the Gentle Fist and Byakugan techniques.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/neji-hyuga-jonin.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/neji-hyuga-jonin-thumb.jpg',
        element: 'None',
        class: 'Hyuga',
        region: 'Hidden Leaf Village',
        quote: 'The Hyuga clan has no weak members.'
    },
    {
        id: 'NU019',
        name: 'Rock Lee (Gated Power)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 81,
            defense: 75,
            speed: 88,
            health: 86
        },
        abilities: ['Eight Gates', 'Strong Fist', 'Leaf Great Whirlwind'],
        description: 'The taijutsu specialist who cannot use ninjutsu or genjutsu. His determination and hard work make him a formidable fighter.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/rock-lee-gated.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/rock-lee-gated-thumb.jpg',
        element: 'None',
        class: 'Taijutsu Specialist',
        region: 'Hidden Leaf Village',
        quote: 'I\'m going to become a splendid ninja! Believe it!'
    },
    {
        id: 'NU020',
        name: 'Temari (Strategic Fighter)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 76,
            defense: 74,
            speed: 82,
            health: 84
        },
        abilities: ['Wind Release', 'Giant Folding Fan', 'Dance of the Crescent Moon'],
        description: 'The eldest daughter of the Fourth Kazekage and a skilled wind user. Uses her fan to control the battlefield strategically.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/temari-strategic.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/temari-strategic-thumb.jpg',
        element: 'Wind',
        class: 'Wind Master',
        region: 'Hidden Sand Village',
        quote: 'I\'m not weak... I\'m just... strategic.'
    },
    {
        id: 'NU021',
        name: 'Kankuro (Puppet Master)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 77,
            defense: 78,
            speed: 74,
            health: 89
        },
        abilities: ['Puppet Mastery', 'Poison', 'Black Secret Technique'],
        description: 'The puppet master of the Sand Siblings. Uses mechanical puppets filled with weapons and poisons in battle.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/kankuro-puppet.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/kankuro-puppet-thumb.jpg',
        element: 'None',
        class: 'Puppet Master',
        region: 'Hidden Sand Village',
        quote: 'My puppets will show you true fear.'
    },
    {
        id: 'NU022',
        name: 'Choji Akimichi (Butterfly Mode)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 80,
            defense: 82,
            speed: 69,
            health: 95
        },
        abilities: ['Expansion Jutsu', 'Butterfly Mode', 'Human Boulder'],
        description: 'The loyal member of Team 10 in his ultimate expansion form. His massive size and strength make him unstoppable.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/choji-akimichi-butterfly.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/choji-akimichi-butterfly-thumb.jpg',
        element: 'None',
        class: 'Akimichi',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not fat... I\'m big-boned!'
    },
    {
        id: 'NU023',
        name: 'Shino Aburame',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 74,
            defense: 76,
            speed: 78,
            health: 83
        },
        abilities: ['Insect Clone', 'Parasitic Destruction Insect', 'Insect Jar'],
        description: 'The quiet member of Team 8 who controls insects as weapons. His mysterious nature hides incredible power.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/shino-aburame.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/shino-aburame-thumb.jpg',
        element: 'None',
        class: 'Aburame',
        region: 'Hidden Leaf Village',
        quote: 'My insects will handle this.'
    },
    {
        id: 'NU024',
        name: 'Hinata Hyuga (Post-War)',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 76,
            defense: 79,
            speed: 80,
            health: 89
        },
        abilities: ['Byakugan', 'Gentle Fist', 'Eight Trigrams Vacuum Palm'],
        description: 'Hinata after the Fourth Great Ninja War, having grown immensely in confidence and power. A skilled medical ninja and loving wife.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/hinata-hyuga-post-war.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/hinata-hyuga-post-war-thumb.jpg',
        element: 'None',
        class: 'Hyuga',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not weak... I\'m just... me.'
    },
    {
        id: 'NU025',
        name: 'Iruka Umino',
        anime: 'Naruto',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 73,
            defense: 75,
            speed: 76,
            health: 87
        },
        abilities: ['Chakra Control', 'Kunai Proficiency', 'Teaching Expertise'],
        description: 'The academy teacher who taught Naruto and many others. A skilled ninja with exceptional chakra control and teaching abilities.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/iruka-umino.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/iruka-umino-thumb.jpg',
        element: 'None',
        class: 'Teacher',
        region: 'Hidden Leaf Village',
        quote: 'You\'re all my precious students!'
    }
];

module.exports = joninCharacters;
