export interface CosplayCharacter {
  id: string;
  name: string;
  japanese: string;
  anime: string;
  category: string;
  role: string;
  age: string;
  power: string;
  affiliation: string;
  rank: string;
  quote: string;
  description: string;
  image: string;
  avatar: string;
  themeColor: string;
  accentGlow: string;
  secondaryColor: string;
  stats: {
    power: number;
    speed: number;
    durability: number;
    intelligence: number;
    combatIQ: number;
  };
  tags: string[];
}

export const categories = [
  'All',
  'Dragon Ball',
  'Naruto',
  'One Piece',
  'Jujutsu Kaisen',
  'Attack on Titan',
  'Demon Slayer',
  'Hunter x Hunter'
];

export const characters: CosplayCharacter[] = [
  {
    id: 'gojo',
    name: 'Satoru Gojo',
    japanese: '五条 悟',
    anime: 'Jujutsu Kaisen',
    category: 'Jujutsu Kaisen',
    role: 'Special Grade Jujutsu Sorcerer & Tokyo Tech Teacher',
    age: '28',
    power: 'Limitless & Six Eyes (Hollow Purple, Unlimited Void)',
    affiliation: 'Tokyo Jujutsu High',
    rank: 'The Honored One / Special Grade',
    quote: '"Throughout heaven and earth, I alone am the honored one."',
    description: 'The indisputable strongest sorcerer of modern times. Satoru possesses the Six Eyes and the boundless Limitless cursed technique, which allows him to manipulate infinite space at an atomic level.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png',
    themeColor: '#00F0FF', // Neon Cyan
    accentGlow: 'rgba(0, 240, 255, 0.45)',
    secondaryColor: '#A855F7',
    stats: {
      power: 99,
      speed: 98,
      durability: 96,
      intelligence: 95,
      combatIQ: 99
    },
    tags: ['Special Grade', 'Infinity', 'Six Eyes', 'Blindfold']
  },
  {
    id: 'goku',
    name: 'Son Goku',
    japanese: '孫悟空 (カカロット)',
    anime: 'Dragon Ball Z / Super',
    category: 'Dragon Ball',
    role: 'Saiyan Warrior & Protector of Earth',
    age: '40s (Saiyan Prime)',
    power: 'Ultra Instinct, Kamehameha, Super Saiyan God/Blue',
    affiliation: 'Z-Fighters / Universe 7',
    rank: 'God-Tier Martial Artist',
    quote: '"I am the hope of the universe! I am the answer to all living things that cry out for peace!"',
    description: 'Born Kakarot, a low-class Saiyan sent to Earth, Goku broke past mortal limits to achieve divine godly states. His cheerful demeanor masks an insatiable drive to test himself against the multiverse\'s strongest beings.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/246-wsRRr6z1kii8.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/246-wsRRr6z1kii8.png',
    themeColor: '#F97316', // Fiery Orange
    accentGlow: 'rgba(249, 115, 22, 0.45)',
    secondaryColor: '#EAB308',
    stats: {
      power: 100,
      speed: 99,
      durability: 100,
      intelligence: 75,
      combatIQ: 100
    },
    tags: ['Saiyan', 'Ultra Instinct', 'Kamehameha', 'God Ki']
  },
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    japanese: 'モンキー・D・ルフィ',
    anime: 'One Piece',
    category: 'One Piece',
    role: 'Captain of the Straw Hat Pirates & Emperor of the Sea',
    age: '19',
    power: 'Gear 5 Sun God Nika, Advanced Conqueror\'s Haki',
    affiliation: 'Straw Hat Pirates',
    rank: 'Yonko (Emperor of the Sea)',
    quote: '"I\'m gonna be the King of the Pirates!"',
    description: 'The freedom-seeking boy who ate the Hito Hito no Mi, Model: Nika. Luffy commands the formidable Straw Hat Grand Fleet and wields world-shattering Advanced Conqueror\'s Haki.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png',
    themeColor: '#EF4444', // Crimson Red
    accentGlow: 'rgba(239, 68, 68, 0.45)',
    secondaryColor: '#F59E0B',
    stats: {
      power: 96,
      speed: 94,
      durability: 98,
      intelligence: 70,
      combatIQ: 97
    },
    tags: ['Yonko', 'Gear 5', 'Conqueror Haki', 'Sun God']
  },
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    japanese: 'うずまきナルト',
    anime: 'Naruto Shippuden',
    category: 'Naruto',
    role: 'Seventh Hokage & Hero of the Hidden Leaf',
    age: '17 (Shippuden) / 32 (Boruto)',
    power: 'Six Paths Sage Mode, Kurama Chakra, Rasenshuriken',
    affiliation: 'Hidden Leaf Village (Konohagakure)',
    rank: 'Seventh Hokage',
    quote: '"I won\'t run away anymore... That is my nindo, my ninja way!"',
    description: 'Once a shunned outcast bearing the Nine-Tailed Fox inside him, Naruto persevered with indomitable will to save the ninja world and realize his lifelong dream of becoming Hokage.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b17-phjcWCkRuIhu.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b17-phjcWCkRuIhu.png',
    themeColor: '#EAB308', // Solar Yellow/Gold
    accentGlow: 'rgba(234, 179, 8, 0.45)',
    secondaryColor: '#F97316',
    stats: {
      power: 97,
      speed: 95,
      durability: 97,
      intelligence: 80,
      combatIQ: 96
    },
    tags: ['Hokage', 'Nine Tails', 'Sage Mode', 'Rasengan']
  },
  {
    id: 'sukuna',
    name: 'Ryomen Sukuna',
    japanese: '両面 宿儺',
    anime: 'Jujutsu Kaisen',
    category: 'Jujutsu Kaisen',
    role: 'King of Curses & Legendary Sorcerer of the Heian Era',
    age: '1000+',
    power: 'Malevolent Shrine (Domain Expansion), Dismantle & Cleave, Fuga',
    affiliation: 'Heian Era Sorcerer / Curse',
    rank: 'King of Curses',
    quote: '"Stand proud. You are strong."',
    description: 'The terrifying King of Curses whose power reigned supreme over the Golden Age of Jujutsu. Ruthless, sadistic, and possessing unmatched knowledge of the true nature of cursed energy.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b133701-rCQuDpHr3UZL.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b133701-rCQuDpHr3UZL.png',
    themeColor: '#D946EF', // Neon Fuchsia / Evil Magenta
    accentGlow: 'rgba(217, 70, 239, 0.45)',
    secondaryColor: '#9333EA',
    stats: {
      power: 100,
      speed: 98,
      durability: 99,
      intelligence: 98,
      combatIQ: 100
    },
    tags: ['King of Curses', 'Domain Expansion', 'Cleave', 'Heian Era']
  },
  {
    id: 'itachi',
    name: 'Itachi Uchiha',
    japanese: 'うちはイタチ',
    anime: 'Naruto Shippuden',
    category: 'Naruto',
    role: 'Rogue Shinobi & Tragic Hero of Konoha',
    age: '21',
    power: 'Mangekyo Sharingan, Tsukuyomi, Amaterasu, Susanoo',
    affiliation: 'Akatsuki (Undercover) / Hidden Leaf',
    rank: 'Anbu Captain / S-Rank Rogue',
    quote: '"People live their lives bound by what they accept as correct and true... That is how they define reality."',
    description: 'A prodigy of the Uchiha clan who bore the unbearable burden of massacring his kin to protect the peace of the Hidden Leaf and safeguard his beloved younger brother, Sasuke.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b14-9Kb1E5oel1ke.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b14-9Kb1E5oel1ke.png',
    themeColor: '#DC2626', // Blood Crimson
    accentGlow: 'rgba(220, 38, 38, 0.45)',
    secondaryColor: '#7C3AED',
    stats: {
      power: 92,
      speed: 94,
      durability: 82,
      intelligence: 100,
      combatIQ: 99
    },
    tags: ['Mangekyo', 'Tsukuyomi', 'Amaterasu', 'Akatsuki']
  },
  {
    id: 'levi',
    name: 'Levi Ackerman',
    japanese: 'リヴァイ・アッカーマン',
    anime: 'Attack on Titan',
    category: 'Attack on Titan',
    role: 'Captain of the Special Operations Squad',
    age: 'Early 30s',
    power: 'Awakened Ackerman Bloodline, Master 3D Maneuver Gear Combat',
    affiliation: 'Scout Regiment',
    rank: "Humanity's Strongest Soldier",
    quote: '"The only thing we\'re allowed to do is believe that we won\'t regret the choice we made."',
    description: 'Clean-obsessed, blunt, but fiercely loyal, Levi is widely recognized as humanity\'s greatest warrior against the Titans, capable of slaughtering entire hordes of giants in seconds.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png',
    themeColor: '#10B981', // Scout Regiment Green
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    secondaryColor: '#059669',
    stats: {
      power: 88,
      speed: 98,
      durability: 85,
      intelligence: 90,
      combatIQ: 98
    },
    tags: ['Ackerman', 'Humanity Strongest', 'Scout Regiment', 'Blades']
  },
  {
    id: 'eren',
    name: 'Eren Yeager',
    japanese: 'エレン・イェーガー',
    anime: 'Attack on Titan',
    category: 'Attack on Titan',
    role: 'Usurper / Wielder of Attack, Founding & War Hammer Titans',
    age: '19',
    power: 'The Rumbling, Founding Titan Omniscience, Future Memory Sight',
    affiliation: 'Yeagerists / Scout Regiment',
    rank: 'Leader of Yeagerists',
    quote: '"If someone tries to steal my freedom, I won\'t hesitate to take theirs."',
    description: 'Driven by an uncompromising desire for freedom, Eren evolves from a headstrong Scout into an unstoppable revolutionary willing to initiate the apocalyptic Rumbling to safeguard his people.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b40882-dsj7IP943WFF.jpg',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b40882-dsj7IP943WFF.jpg',
    themeColor: '#84CC16', // Titan Acid Green / Lime
    accentGlow: 'rgba(132, 204, 22, 0.45)',
    secondaryColor: '#15803D',
    stats: {
      power: 99,
      speed: 90,
      durability: 98,
      intelligence: 88,
      combatIQ: 94
    },
    tags: ['Founding Titan', 'Attack Titan', 'The Rumbling', 'Freedom']
  },
  {
    id: 'tanjiro',
    name: 'Tanjiro Kamado',
    japanese: '竈門 炭治郎',
    anime: 'Demon Slayer: Kimetsu no Yaiba',
    category: 'Demon Slayer',
    role: 'Demon Slayer & Master of Hinokami Kagura',
    age: '16',
    power: 'Sun Breathing (Hinokami Kagura), Transparent World, Slayer Mark',
    affiliation: 'Demon Slayer Corps',
    rank: 'Kanoe / Master Swordsman',
    quote: '"No matter how many people you may lose, you have no choice but to go on living."',
    description: 'A kind-hearted boy with an extraordinary sense of smell who took up the sword to cure his demonized sister Nezuko and avenged his family against Muzan Kibutsuji.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b126071-BTNEc1nRIv68.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b126071-BTNEc1nRIv68.png',
    themeColor: '#059669', // Emerald Nichirin Green
    accentGlow: 'rgba(5, 150, 105, 0.45)',
    secondaryColor: '#DC2626',
    stats: {
      power: 90,
      speed: 92,
      durability: 91,
      intelligence: 85,
      combatIQ: 95
    },
    tags: ['Sun Breathing', 'Nichirin Blade', 'Demon Slayer', 'Slayer Mark']
  },
  {
    id: 'killua',
    name: 'Killua Zoldyck',
    japanese: 'キルア=ゾルディック',
    anime: 'Hunter x Hunter',
    category: 'Hunter x Hunter',
    role: 'Rookie Hunter & Former Elite Assassin',
    age: '14',
    power: 'Transmutation Nen: Godspeed (Whirlwind & Speed of Lightning)',
    affiliation: 'Zoldyck Family / Hunter Association',
    rank: 'Licensed Pro Hunter',
    quote: '"If you ignore friends you had the ability to help, wouldn\'t you be betraying them?"',
    description: 'Heir to the notorious Zoldyck family of deadly assassins, Killua broke away from his dark heritage upon befriending Gon. His Transmutation Nen turns electric aura into near-lightspeed reflexes.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b27-Z5O02kQUydpT.jpg',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b27-Z5O02kQUydpT.jpg',
    themeColor: '#818CF8', // Electric Indigo
    accentGlow: 'rgba(129, 140, 248, 0.45)',
    secondaryColor: '#38BDF8',
    stats: {
      power: 89,
      speed: 99,
      durability: 86,
      intelligence: 96,
      combatIQ: 97
    },
    tags: ['Godspeed', 'Assassin', 'Lightning Nen', 'Zoldyck']
  },
  {
    id: 'zoro',
    name: 'Roronoa Zoro',
    japanese: 'ロロノア・ゾロ',
    anime: 'One Piece',
    category: 'One Piece',
    role: 'Combatant / Swordsman of the Straw Hat Pirates',
    age: '21',
    power: 'Three-Sword Style (Santoryu), King of Hell, Enma Blade',
    affiliation: 'Straw Hat Pirates',
    rank: 'Master Swordsman / Supernova',
    quote: '"When the world shoves you around, you\'ve just gotta stand up and shove back."',
    description: 'The King of Hell wielding legendary Meito blades including Enma. Zoro trains relentlessly to fulfill his vow to Kuina and become the world\'s undisputed greatest swordsman.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b62-S7oAeA9WInjV.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b62-S7oAeA9WInjV.png',
    themeColor: '#10B981', // Santoryu Green
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    secondaryColor: '#6366F1',
    stats: {
      power: 95,
      speed: 92,
      durability: 99,
      intelligence: 74,
      combatIQ: 96
    },
    tags: ['Three Swords', 'Enma', 'King of Hell', 'Straw Hat']
  },
  {
    id: 'vegeta',
    name: 'Vegeta',
    japanese: 'ベジータ',
    anime: 'Dragon Ball Z / Super',
    category: 'Dragon Ball',
    role: 'Prince of all Saiyans',
    age: '40s (Saiyan Prime)',
    power: 'Ultra Ego, Final Flash, Big Bang Attack, Hakai Energy',
    affiliation: 'Z-Fighters / Saiyan Royal Family',
    rank: 'Saiyan Prince & God-Tier Fighter',
    quote: '"There is only one certainty in life. A strong man stands above and conquers all!"',
    description: 'The proud Prince of the Saiyan race. Through relentless discipline, royal pride, and unwavering determination, Vegeta attained the God of Destruction power known as Ultra Ego.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b913-NIFkKazWM8VO.png',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b913-NIFkKazWM8VO.png',
    themeColor: '#3B82F6', // Royal Saiyan Blue
    accentGlow: 'rgba(59, 130, 246, 0.45)',
    secondaryColor: '#A855F7',
    stats: {
      power: 99,
      speed: 98,
      durability: 98,
      intelligence: 89,
      combatIQ: 99
    },
    tags: ['Ultra Ego', 'Saiyan Prince', 'Final Flash', 'Hakai']
  }
];

// Web Audio API Anime Switcher Sound FX
let audioCtx: any = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSwitchSound(frequency = 520) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch {}
}

export function playPowerSurgeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.25);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {}
}
