/**
 * Naruto Chunin Characters (RARE tier)
 * ID Format: NU006, NU007, etc.
 */

const chuninCharacters = [
    {
        id: 'NU006',
        name: 'Shikamaru Nara (Chunin Exam Winner)',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 70,
            defense: 66,
            speed: 72,
            health: 80
        },
        abilities: ['Shadow Possession', 'Strategic Mind', 'Ninja Tools'],
        description: 'The brilliant strategist who passed the Chunin exams. His tactical genius makes him a valuable asset in any team.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/shikamaru-nara-chunin.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/shikamaru-nara-chunin-thumb.jpg',
        element: 'None',
        class: 'Strategist',
        region: 'Hidden Leaf Village',
        quote: 'What a drag...'
    },
    {
        id: 'NU007',
        name: 'Choji Akimichi (Standard)',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 74,
            defense: 78,
            speed: 65,
            health: 86
        },
        abilities: ['Expansion Jutsu', 'Human Boulder', 'Chakra Absorption'],
        description: 'The loyal member of Team 10 with a big appetite and even bigger heart. Master of expansion techniques.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/choji-akimichi-standard.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/choji-akimichi-standard-thumb.jpg',
        element: 'None',
        class: 'Akimichi',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not fat... I\'m big-boned!'
    },
    {
        id: 'NU008',
        name: 'Kiba Inuzuka',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 73,
            defense: 70,
            speed: 79,
            health: 81
        },
        abilities: ['Beast Human Clone', 'Fang Over Fang', 'Dynamic Marking'],
        description: 'The wild member of Team 8 partnered with his ninja dog Akamaru. Known for his enhanced senses and feral fighting style.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/kiba-inuzuka.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/kiba-inuzuka-thumb.jpg',
        element: 'None',
        class: 'Inuzuka',
        region: 'Hidden Leaf Village',
        quote: 'Let\'s do this, Akamaru!'
    },
    {
        id: 'NU009',
        name: 'Ino Yamanaka',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 69,
            defense: 67,
            speed: 74,
            health: 79
        },
        abilities: ['Mind Transfer', 'Mind Body Switch', 'Chakra Threads'],
        description: 'The elegant member of Team 10 with exceptional intelligence. Master of mind-based techniques and sensory abilities.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/ino-yamanaka.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/ino-yamanaka-thumb.jpg',
        element: 'None',
        class: 'Yamanaka',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not just a pretty face!'
    },
    {
        id: 'NU010',
        name: 'Tenten',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 72,
            defense: 71,
            speed: 76,
            health: 83
        },
        abilities: ['Weapon Summoning', 'Precision Strike', 'Weapon Creation'],
        description: 'The weapons specialist of Team Guy. Master of all forms of weaponry and precision combat techniques.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/tenten.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/tenten-thumb.jpg',
        element: 'None',
        class: 'Weapons Specialist',
        region: 'Hidden Leaf Village',
        quote: 'My weapons will show you true power!'
    },
    {
        id: 'NU011',
        name: 'Konohamaru Sarutobi (Early Shippuden)',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 67,
            defense: 64,
            speed: 78,
            health: 77
        },
        abilities: ['Rasengan', 'Shadow Clone', 'Ninja Tools'],
        description: 'The grandson of the Third Hokage, aspiring to become a great ninja like Naruto. Shows great potential and determination.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/konohamaru-sarutobi-early.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/konohamaru-sarutobi-early-thumb.jpg',
        element: 'None',
        class: 'Ninja',
        region: 'Hidden Leaf Village',
        quote: 'I\'ll become a better ninja than Naruto!'
    },
    {
        id: 'NU012',
        name: 'Anko Mitarashi',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 76,
            defense: 72,
            speed: 78,
            health: 83
        },
        abilities: ['Snake Summoning', 'Poison Techniques', 'Cursed Seal'],
        description: 'The former student of Orochimaru and a skilled tokubetsu jonin. Known for her snake summoning and cursed seal knowledge.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/anko-mitarashi.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/anko-mitarashi-thumb.jpg',
        element: 'None',
        class: 'Tokubetsu Jonin',
        region: 'Hidden Leaf Village',
        quote: 'Don\'t underestimate me!'
    },
    {
        id: 'NU013',
        name: 'Kurenai Yuhi',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 71,
            defense: 69,
            speed: 73,
            health: 84
        },
        abilities: ['Genjutsu', 'Illusion Techniques', 'Mind Control'],
        description: 'The jonin sensei of Team 8 and a master of genjutsu. Known for her beauty and exceptional illusion techniques.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/kurenai-yuhi.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/kurenai-yuhi-thumb.jpg',
        element: 'None',
        class: 'Genjutsu Master',
        region: 'Hidden Leaf Village',
        quote: 'Genjutsu is the art of deception.'
    },
    {
        id: 'NU014',
        name: 'Asuma Sarutobi',
        anime: 'Naruto',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 77,
            defense: 74,
            speed: 75,
            health: 87
        },
        abilities: ['Wind Release', 'Flying Swallow', 'Chakra Blades'],
        description: 'The jonin sensei of Team 10 and son of the Third Hokage. Master of wind techniques and chakra-enhanced weapons.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/asuma-sarutobi.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/asuma-sarutobi-thumb.jpg',
        element: 'Wind',
        class: 'Jonin',
        region: 'Hidden Leaf Village',
        quote: 'I\'ll protect my team with my life.'
    }
];

module.exports = chuninCharacters;
