/**
 * Naruto Ultimate Characters (MYTHIC tier)
 * ID Format: NU040, NU041, etc.
 */

const ultimateCharacters = [
    {
        id: 'NU040',
        name: 'Naruto Uzumaki (Kurama Chakra Mode)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 90,
            defense: 82,
            speed: 95,
            health: 102
        },
        abilities: ['Rasenshuriken', 'Tailed Beast Bomb', 'Kurama Avatar'],
        description: 'Naruto in his Kurama Chakra Mode, achieving perfect harmony with the Nine-Tails. His power rivals even the legendary sannin.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/naruto-uzumaki-kcm.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/naruto-uzumaki-kcm-thumb.jpg',
        element: 'Wind',
        class: 'Ninja',
        region: 'Hidden Leaf Village',
        quote: 'Believe it!'
    },
    {
        id: 'NU041',
        name: 'Sasuke Uchiha (Eternal Mangekyo Sharingan)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 88,
            defense: 80,
            speed: 90,
            health: 98
        },
        abilities: ['Chibaku Tensei', 'Indra\'s Arrow', 'Eternal Mangekyo Sharingan'],
        description: 'Sasuke with his Eternal Mangekyo Sharingan, having taken Itachi\'s eyes. His power and determination make him a force to be reckoned with.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/sasuke-uchiha-eternal.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/sasuke-uchiha-eternal-thumb.jpg',
        element: 'Fire',
        class: 'Uchiha',
        region: 'Hidden Leaf Village',
        quote: 'I will restore my clan... and kill a certain someone.'
    },
    {
        id: 'NU042',
        name: 'Might Guy (Eighth Gate)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 89,
            defense: 85,
            speed: 96,
            health: 104
        },
        abilities: ['Eight Gates Formation', 'Morning Peacock', 'Evening Elephant'],
        description: 'Guy in his ultimate form, opening all eight gates. His taijutsu reaches superhuman levels, making him a legendary fighter.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/might-guy-eighth-gate.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/might-guy-eighth-gate-thumb.jpg',
        element: 'None',
        class: 'Taijutsu Master',
        region: 'Hidden Leaf Village',
        quote: 'I\'ll show you the power of hard work!'
    },
    {
        id: 'NU043',
        name: 'Kakashi Hatake (Double Mangekyo Sharingan)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 87,
            defense: 78,
            speed: 88,
            health: 96
        },
        abilities: ['Kamui', 'Raikiri', 'Sharingan'],
        description: 'Kakashi with both Obito\'s and his own Mangekyo Sharingan. The legendary Copy Ninja reaches his full potential.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/kakashi-hatake-double.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/kakashi-hatake-double-thumb.jpg',
        element: 'Lightning',
        class: 'Jonin',
        region: 'Hidden Leaf Village',
        quote: 'I\'m Kakashi Hatake. Things I like and things I hate... I don\'t feel like telling you that.'
    },
    {
        id: 'NU044',
        name: 'Minato Namikaze (Edo Form with Kurama)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 91,
            defense: 83,
            speed: 97,
            health: 99
        },
        abilities: ['Flying Thunder God', 'Rasengan', 'Kurama Control'],
        description: 'The Fourth Hokage resurrected through Edo Tensei, with full control over the Nine-Tails. The Yellow Flash of the Leaf.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/minato-namikaze-edo-kurama.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/minato-namikaze-edo-kurama-thumb.jpg',
        element: 'None',
        class: 'Hokage',
        region: 'Hidden Leaf Village',
        quote: 'I will become Hokage!'
    },
    {
        id: 'NU045',
        name: 'Hashirama Senju',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 91,
            defense: 89,
            speed: 84,
            health: 107
        },
        abilities: ['Wood Release', 'Sage Mode', 'Creation of All Things'],
        description: 'The legendary First Hokage and founder of the Hidden Leaf Village. His Wood Release techniques are unmatched.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/hashirama-senju.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/hashirama-senju-thumb.jpg',
        element: 'Wood',
        class: 'Hokage',
        region: 'Hidden Leaf Village',
        quote: 'The true meaning of a shinobi is not in their death, but in how they live.'
    },
    {
        id: 'NU046',
        name: 'Itachi Uchiha (Edo Form)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 86,
            defense: 76,
            speed: 87,
            health: 94
        },
        abilities: ['Tsukuyomi', 'Amaterasu', 'Susanoo'],
        description: 'Itachi Uchiha resurrected through Edo Tensei. The prodigy of the Uchiha clan with unmatched genjutsu prowess.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/itachi-uchiha-edo.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/itachi-uchiha-edo-thumb.jpg',
        element: 'Fire',
        class: 'Uchiha',
        region: 'Hidden Leaf Village',
        quote: 'People live their lives bound by what they accept as correct and true.'
    },
    {
        id: 'NU047',
        name: 'Nagato (Pain)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 89,
            defense: 81,
            speed: 85,
            health: 103
        },
        abilities: ['Rinnegan', 'Six Paths of Pain', 'Universal Pull'],
        description: 'Nagato in his Pain form, controlling the Six Paths of Pain. The leader of the Akatsuki with god-like powers.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/nagato-pain.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/nagato-pain-thumb.jpg',
        element: 'None',
        class: 'Rinnegan User',
        region: 'Hidden Rain Village',
        quote: 'Those who do not understand true pain can never understand true peace.'
    },
    {
        id: 'NU048',
        name: 'Killer Bee (Eight-Tails Full Control)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 88,
            defense: 87,
            speed: 89,
            health: 105
        },
        abilities: ['Eight-Tails Control', 'Lariat', 'Ink Creation'],
        description: 'Killer Bee with full control over the Eight-Tails. The perfect jinchuriki and rapper extraordinaire.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/killer-bee-eight-tails.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/killer-bee-eight-tails-thumb.jpg',
        element: 'None',
        class: 'Jinchuriki',
        region: 'Hidden Cloud Village',
        quote: 'I\'m the Eight-Tails\' jinchuriki, Killer Bee!'
    }
];

module.exports = ultimateCharacters;
