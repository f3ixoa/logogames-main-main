// Предложения с пропусками для каждого звука
export const sentences = {
  "hard-r": [
    {
      id: 1,
      sentence: "Мальчик играет с _____.",
      correctAnswer: "ракетой",
      targetWord: "ракета",
      options: [
        { text: "ракетой", emoji: "🚀" },
        { text: "куклой", emoji: "🪆" },
        { text: "машиной", emoji: "🚗" }
      ],
      emoji: "🚀",
      audioPrompt: "Привет! Мальчик играет с ракетой. Повтори: ракета!"
    },
    {
      id: 2,
      sentence: "На небе яркая _____.",
      correctAnswer: "радуга",
      targetWord: "радуга",
      options: [
        { text: "радуга", emoji: "🌈" },
        { text: "туча", emoji: "☁️" },
        { text: "птица", emoji: "🐦" }
      ],
      emoji: "🌈",
      audioPrompt: "Смотри! На небе яркая радуга. Повтори: радуга!"
    },
    {
      id: 3,
      sentence: "В аквариуме плавает _____.",
      correctAnswer: "рыба",
      targetWord: "рыба",
      options: [
        { text: "рыба", emoji: "🐟" },
        { text: "утка", emoji: "🦆" },
        { text: "кошка", emoji: "🐱" }
      ],
      emoji: "🐟",
      audioPrompt: "В аквариуме плавает рыба. Повтори: рыба!"
    },
    {
      id: 4,
      sentence: "Мама дарит красивую _____.",
      correctAnswer: "розу",
      targetWord: "роза",
      options: [
        { text: "розу", emoji: "🌹" },
        { text: "книгу", emoji: "📚" },
        { text: "игру", emoji: "🎮" }
      ],
      emoji: "🌹",
      audioPrompt: "Мама дарит красивую розу. Повтори: роза!"
    },
    {
      id: 5,
      sentence: "Ребёнок рисует _____.",
      correctAnswer: "ракету",
      targetWord: "ракета",
      options: [
        { text: "ракету", emoji: "🚀" },
        { text: "дом", emoji: "🏠" },
        { text: "кота", emoji: "🐈" }
      ],
      emoji: "🚀",
      audioPrompt: "Ребёнок рисует ракету. Повтори: ракета!"
    },
    {
      id: 6,
      sentence: "На пляже ползёт _____.",
      correctAnswer: "рак",
      targetWord: "рак",
      options: [
        { text: "рак", emoji: "🦀" },
        { text: "жук", emoji: "🪲" },
        { text: "муха", emoji: "🪰" }
      ],
      emoji: "🦀",
      audioPrompt: "На пляже ползёт рак. Повтори: рак!"
    },
    {
      id: 7,
      sentence: "Папа поднял _____.",
      correctAnswer: "руку",
      targetWord: "рука",
      options: [
        { text: "руку", emoji: "✋" },
        { text: "ногу", emoji: "🦵" },
        { text: "голову", emoji: "🗣️" }
      ],
      emoji: "✋",
      audioPrompt: "Папа поднял руку. Повтори: рука!"
    },
    {
      id: 8,
      sentence: "В саду растёт _____.",
      correctAnswer: "роза",
      targetWord: "роза",
      options: [
        { text: "роза", emoji: "🌹" },
        { text: "яблоко", emoji: "🍎" },
        { text: "гриб", emoji: "🍄" }
      ],
      emoji: "🌹",
      audioPrompt: "В саду растёт роза. Повтори: роза!"
    }
  ],
  "soft-r": [
    {
      id: 1,
      sentence: "В школу я несу _____.",
      correctAnswer: "рюкзак",
      targetWord: "рюкзак",
      options: [
        { text: "рюкзак", emoji: "🎒" },
        { text: "портфель", emoji: "💼" },
        { text: "сумку", emoji: "👜" }
      ],
      emoji: "🎒",
      audioPrompt: "В школу я несу рюкзак. Повтори: рюкзак!"
    },
    {
      id: 2,
      sentence: "На завтрак мама дала _____.",
      correctAnswer: "ряженку",
      targetWord: "ряженка",
      options: [
        { text: "ряженку", emoji: "🥛" },
        { text: "молоко", emoji: "🍼" },
        { text: "воду", emoji: "💧" }
      ],
      emoji: "🥛",
      audioPrompt: "На завтрак мама дала ряженку. Повтори: ряженка!"
    },
    {
      id: 3,
      sentence: "Осенью краснеет _____.",
      correctAnswer: "рябина",
      targetWord: "рябина",
      options: [
        { text: "рябина", emoji: "🌳" },
        { text: "берёза", emoji: "🌲" },
        { text: "сосна", emoji: "🎄" }
      ],
      emoji: "🌳",
      audioPrompt: "Осенью краснеет рябина. Повтори: рябина!"
    },
    {
      id: 4,
      sentence: "Мы пошли купаться на _____.",
      correctAnswer: "реку",
      targetWord: "река",
      options: [
        { text: "реку", emoji: "🏞️" },
        { text: "море", emoji: "🌊" },
        { text: "озеро", emoji: "💦" }
      ],
      emoji: "🏞️",
      audioPrompt: "Мы пошли купаться на реку. Повтори: река!"
    },
    {
      id: 5,
      sentence: "На обед бабушка сварила _____.",
      correctAnswer: "рис",
      targetWord: "рис",
      options: [
        { text: "рис", emoji: "🍚" },
        { text: "суп", emoji: "🍲" },
        { text: "кашу", emoji: "🥣" }
      ],
      emoji: "🍚",
      audioPrompt: "На обед бабушка сварила рис. Повтори: рис!"
    }
  ],
  "hard-l": [
    {
      id: 1,
      sentence: "Ночью светит яркая _____.",
      correctAnswer: "луна",
      targetWord: "луна",
      options: [
        { text: "луна", emoji: "🌙" },
        { text: "звезда", emoji: "⭐" },
        { text: "комета", emoji: "☄️" }
      ],
      emoji: "🌙",
      audioPrompt: "Ночью светит яркая луна. Повтори: луна!"
    },
    {
      id: 2,
      sentence: "На столе стоит _____.",
      correctAnswer: "лампа",
      targetWord: "лампа",
      options: [
        { text: "лампа", emoji: "💡" },
        { text: "ваза", emoji: "🏺" },
        { text: "часы", emoji: "⏰" }
      ],
      emoji: "💡",
      audioPrompt: "На столе стоит лампа. Повтори: лампа!"
    },
    {
      id: 3,
      sentence: "По реке плывёт _____.",
      correctAnswer: "лодка",
      targetWord: "лодка",
      options: [
        { text: "лодка", emoji: "⛵" },
        { text: "рыба", emoji: "🐟" },
        { text: "утка", emoji: "🦆" }
      ],
      emoji: "⛵",
      audioPrompt: "По реке плывёт лодка. Повтори: лодка!"
    },
    {
      id: 4,
      sentence: "В супе лежит _____.",
      correctAnswer: "лук",
      targetWord: "лук",
      options: [
        { text: "лук", emoji: "🧅" },
        { text: "мясо", emoji: "🥩" },
        { text: "хлеб", emoji: "🍞" }
      ],
      emoji: "🧅",
      audioPrompt: "В супе лежит лук. Повтори: лук!"
    },
    {
      id: 5,
      sentence: "Звери живут в _____.",
      correctAnswer: "лесу",
      targetWord: "лес",
      options: [
        { text: "лесу", emoji: "🌲" },
        { text: "доме", emoji: "🏠" },
        { text: "городе", emoji: "🏙️" }
      ],
      emoji: "🌲",
      audioPrompt: "Звери живут в лесу. Повтори: лес!"
    }
  ],
  "soft-l": [
    {
      id: 1,
      sentence: "Из жёлтого _____ делают сок.",
      correctAnswer: "лимона",
      targetWord: "лимон",
      options: [
        { text: "лимона", emoji: "🍋" },
        { text: "апельсина", emoji: "🍊" },
        { text: "яблока", emoji: "🍎" }
      ],
      emoji: "🍋",
      audioPrompt: "Из жёлтого лимона делают сок. Повтори: лимон!"
    },
    {
      id: 2,
      sentence: "Рыжая _____ живёт в норе.",
      correctAnswer: "лиса",
      targetWord: "лиса",
      options: [
        { text: "лиса", emoji: "🦊" },
        { text: "белка", emoji: "🐿️" },
        { text: "мышь", emoji: "🐭" }
      ],
      emoji: "🦊",
      audioPrompt: "Рыжая лиса живёт в норе. Повтори: лиса!"
    },
    {
      id: 3,
      sentence: "На озере плавает белый _____.",
      correctAnswer: "лебедь",
      targetWord: "лебедь",
      options: [
        { text: "лебедь", emoji: "🦢" },
        { text: "гусь", emoji: "🦢" },
        { text: "утка", emoji: "🦆" }
      ],
      emoji: "🦢",
      audioPrompt: "На озере плавает белый лебедь. Повтори: лебедь!"
    },
    {
      id: 4,
      sentence: "С дерева упал жёлтый _____.",
      correctAnswer: "лист",
      targetWord: "лист",
      options: [
        { text: "лист", emoji: "🍂" },
        { text: "плод", emoji: "🍇" },
        { text: "цветок", emoji: "🌸" }
      ],
      emoji: "🍂",
      audioPrompt: "С дерева упал жёлтый лист. Повтори: лист!"
    },
    {
      id: 5,
      sentence: "Девочка завязала красивую _____.",
      correctAnswer: "ленту",
      targetWord: "лента",
      options: [
        { text: "ленту", emoji: "🎀" },
        { text: "косу", emoji: "👧" },
        { text: "бант", emoji: "🎗️" }
      ],
      emoji: "🎀",
      audioPrompt: "Девочка завязала красивую ленту. Повтори: лента!"
    }
  ],
  "hard-s": [
    {
      id: 1,
      sentence: "Мама купила яблочный _____.",
      correctAnswer: "сок",
      targetWord: "сок",
      options: [
        { text: "сок", emoji: "🧃" },
        { text: "чай", emoji: "🍵" },
        { text: "компот", emoji: "🥤" }
      ],
      emoji: "🧃",
      audioPrompt: "Мама купила яблочный сок. Повтори: сок!"
    },
    {
      id: 2,
      sentence: "В зоопарке живёт большой _____.",
      correctAnswer: "слон",
      targetWord: "слон",
      options: [
        { text: "слон", emoji: "🐘" },
        { text: "тигр", emoji: "🐯" },
        { text: "лев", emoji: "🦁" }
      ],
      emoji: "🐘",
      audioPrompt: "В зоопарке живёт большой слон. Повтори: слон!"
    },
    {
      id: 3,
      sentence: "На дереве сидит мудрая _____.",
      correctAnswer: "сова",
      targetWord: "сова",
      options: [
        { text: "сова", emoji: "🦉" },
        { text: "ворона", emoji: "🐦‍⬛" },
        { text: "галка", emoji: "🐦" }
      ],
      emoji: "🦉",
      audioPrompt: "На дереве сидит мудрая сова. Повтори: сова!"
    },
    {
      id: 4,
      sentence: "Утром встаёт яркое _____.",
      correctAnswer: "солнце",
      targetWord: "солнце",
      options: [
        { text: "солнце", emoji: "☀️" },
        { text: "облако", emoji: "☁️" },
        { text: "небо", emoji: "🌤️" }
      ],
      emoji: "☀️",
      audioPrompt: "Утром встаёт яркое солнце. Повтори: солнце!"
    },
    {
      id: 5,
      sentence: "Во дворе лает _____.",
      correctAnswer: "собака",
      targetWord: "собака",
      options: [
        { text: "собака", emoji: "🐕" },
        { text: "кошка", emoji: "🐈" },
        { text: "птица", emoji: "🐦" }
      ],
      emoji: "🐕",
      audioPrompt: "Во дворе лает собака. Повтори: собака!"
    }
  ],
  "soft-s": [
    {
      id: 1,
      sentence: "На ветке чирикает _____.",
      correctAnswer: "синица",
      targetWord: "синица",
      options: [
        { text: "синица", emoji: "🐦" },
        { text: "воробей", emoji: "🐦‍⬛" },
        { text: "голубь", emoji: "🕊️" }
      ],
      emoji: "🐦",
      audioPrompt: "На ветке чирикает синица. Повтори: синица!"
    },
    {
      id: 2,
      sentence: "Весной цветёт душистая _____.",
      correctAnswer: "сирень",
      targetWord: "сирень",
      options: [
        { text: "сирень", emoji: "💜" },
        { text: "роза", emoji: "🌹" },
        { text: "ромашка", emoji: "🌼" }
      ],
      emoji: "💜",
      audioPrompt: "Весной цветёт душистая сирень. Повтори: сирень!"
    },
    {
      id: 3,
      sentence: "Бабушка просеивает муку через _____.",
      correctAnswer: "сито",
      targetWord: "сито",
      options: [
        { text: "сито", emoji: "🥄" },
        { text: "дуршлаг", emoji: "🍲" },
        { text: "миску", emoji: "🥣" }
      ],
      emoji: "🥄",
      audioPrompt: "Бабушка просеивает муку через сито. Повтори: сито!"
    },
    {
      id: 4,
      sentence: "Дней в неделе ровно _____.",
      correctAnswer: "семь",
      targetWord: "семь",
      options: [
        { text: "семь", emoji: "7️⃣" },
        { text: "пять", emoji: "5️⃣" },
        { text: "десять", emoji: "🔟" }
      ],
      emoji: "7️⃣",
      audioPrompt: "Дней в неделе ровно семь. Повтори: семь!"
    }
  ],
  "hard-z": [
    {
      id: 1,
      sentence: "По лесу прыгает серый _____.",
      correctAnswer: "заяц",
      targetWord: "заяц",
      options: [
        { text: "заяц", emoji: "🐰" },
        { text: "волк", emoji: "🐺" },
        { text: "медведь", emoji: "🐻" }
      ],
      emoji: "🐰",
      audioPrompt: "По лесу прыгает серый заяц. Повтори: заяц!"
    },
    {
      id: 2,
      sentence: "Когда идёт дождь, я беру _____.",
      correctAnswer: "зонт",
      targetWord: "зонт",
      options: [
        { text: "зонт", emoji: "☂️" },
        { text: "шапку", emoji: "🧢" },
        { text: "шарф", emoji: "🧣" }
      ],
      emoji: "☂️",
      audioPrompt: "Когда идёт дождь, я беру зонт. Повтори: зонт!"
    },
    {
      id: 3,
      sentence: "У короля есть большой _____.",
      correctAnswer: "замок",
      targetWord: "замок",
      options: [
        { text: "замок", emoji: "🏰" },
        { text: "дворец", emoji: "🏛️" },
        { text: "башня", emoji: "🗼" }
      ],
      emoji: "🏰",
      audioPrompt: "У короля есть большой замок. Повтори: замок!"
    },
    {
      id: 4,
      sentence: "В саванне живёт полосатая _____.",
      correctAnswer: "зебра",
      targetWord: "зебра",
      options: [
        { text: "зебра", emoji: "🦓" },
        { text: "лошадь", emoji: "🐴" },
        { text: "жираф", emoji: "🦒" }
      ],
      emoji: "🦓",
      audioPrompt: "В саванне живёт полосатая зебра. Повтори: зебра!"
    }
  ],
  "soft-z": [
    {
      id: 1,
      sentence: "Когда холодно, наступает _____.",
      correctAnswer: "зима",
      targetWord: "зима",
      options: [
        { text: "зима", emoji: "❄️" },
        { text: "осень", emoji: "🍂" },
        { text: "весна", emoji: "🌸" }
      ],
      emoji: "❄️",
      audioPrompt: "Когда холодно, наступает зима. Повтори: зима!"
    },
    {
      id: 2,
      sentence: "Мы живём на планете _____.",
      correctAnswer: "Земля",
      targetWord: "Земля",
      options: [
        { text: "Земля", emoji: "🌍" },
        { text: "Марс", emoji: "🔴" },
        { text: "Луна", emoji: "🌙" }
      ],
      emoji: "🌍",
      audioPrompt: "Мы живём на планете Земля. Повтори: Земля!"
    },
    {
      id: 3,
      sentence: "Девочка смотрится в _____.",
      correctAnswer: "зеркало",
      targetWord: "зеркало",
      options: [
        { text: "зеркало", emoji: "🪞" },
        { text: "окно", emoji: "🪟" },
        { text: "экран", emoji: "📱" }
      ],
      emoji: "🪞",
      audioPrompt: "Девочка смотрится в зеркало. Повтори: зеркало!"
    }
  ],
  "hard-sh": [
    {
      id: 1,
      sentence: "На празднике я держу воздушный _____.",
      correctAnswer: "шар",
      targetWord: "шар",
      options: [
        { text: "шар", emoji: "🎈" },
        { text: "флаг", emoji: "🚩" },
        { text: "цветок", emoji: "🌸" }
      ],
      emoji: "🎈",
      audioPrompt: "На празднике я держу воздушный шар. Повтори: шар!"
    },
    {
      id: 2,
      sentence: "Зимой я надеваю тёплую _____.",
      correctAnswer: "шапку",
      targetWord: "шапка",
      options: [
        { text: "шапку", emoji: "🧢" },
        { text: "куртку", emoji: "🧥" },
        { text: "обувь", emoji: "👢" }
      ],
      emoji: "🧢",
      audioPrompt: "Зимой я надеваю тёплую шапку. Повтори: шапка!"
    },
    {
      id: 3,
      sentence: "Бабушка носит меховую _____.",
      correctAnswer: "шубу",
      targetWord: "шуба",
      options: [
        { text: "шубу", emoji: "🧥" },
        { text: "шаль", emoji: "🧣" },
        { text: "юбку", emoji: "👗" }
      ],
      emoji: "🧥",
      audioPrompt: "Бабушка носит меховую шубу. Повтори: шуба!"
    },
    {
      id: 4,
      sentence: "В норке живёт маленькая _____.",
      correctAnswer: "мышь",
      targetWord: "мышь",
      options: [
        { text: "мышь", emoji: "🐭" },
        { text: "крыса", emoji: "🐀" },
        { text: "хомяк", emoji: "🐹" }
      ],
      emoji: "🐭",
      audioPrompt: "В норке живёт маленькая мышь. Повтори: мышь!"
    }
  ],
  "hard-zh": [
    {
      id: 1,
      sentence: "По листу ползёт зелёный _____.",
      correctAnswer: "жук",
      targetWord: "жук",
      options: [
        { text: "жук", emoji: "🪲" },
        { text: "червяк", emoji: "🪱" },
        { text: "паук", emoji: "🕷️" }
      ],
      emoji: "🪲",
      audioPrompt: "По листу ползёт зелёный жук. Повтори: жук!"
    },
    {
      id: 2,
      sentence: "В Африке живёт высокий _____.",
      correctAnswer: "жираф",
      targetWord: "жираф",
      options: [
        { text: "жираф", emoji: "🦒" },
        { text: "слон", emoji: "🐘" },
        { text: "носорог", emoji: "🦏" }
      ],
      emoji: "🦒",
      audioPrompt: "В Африке живёт высокий жираф. Повтори: жираф!"
    },
    {
      id: 3,
      sentence: "В лесу под деревом сидит колючий _____.",
      correctAnswer: "ёж",
      targetWord: "ёж",
      options: [
        { text: "ёж", emoji: "🦔" },
        { text: "ёршик", emoji: "🧹" },
        { text: "ёлка", emoji: "🎄" }
      ],
      emoji: "🦔",
      audioPrompt: "В лесу под деревом сидит колючий ёж. Повтори: ёж!"
    },
    {
      id: 4,
      sentence: "У пруда квакает зелёная _____.",
      correctAnswer: "жаба",
      targetWord: "жаба",
      options: [
        { text: "жаба", emoji: "🐸" },
        { text: "лягушка", emoji: "🐸" },
        { text: "утка", emoji: "🦆" }
      ],
      emoji: "🐸",
      audioPrompt: "У пруда квакает зелёная жаба. Повтори: жаба!"
    }
  ],
  "soft-shch": [
    {
      id: 1,
      sentence: "Я чищу зубы зубной _____.",
      correctAnswer: "щёткой",
      targetWord: "щётка",
      options: [
        { text: "щёткой", emoji: "🪥" },
        { text: "пастой", emoji: "🧴" },
        { text: "нитью", emoji: "🧵" }
      ],
      emoji: "🪥",
      audioPrompt: "Я чищу зубы зубной щёткой. Повтори: щётка!"
    },
    {
      id: 2,
      sentence: "В реке плавает хищная _____.",
      correctAnswer: "щука",
      targetWord: "щука",
      options: [
        { text: "щука", emoji: "🐟" },
        { text: "сом", emoji: "🐠" },
        { text: "карась", emoji: "🐡" }
      ],
      emoji: "🐟",
      audioPrompt: "В реке плавает хищная щука. Повтори: щука!"
    },
    {
      id: 3,
      sentence: "У собаки родился маленький _____.",
      correctAnswer: "щенок",
      targetWord: "щенок",
      options: [
        { text: "щенок", emoji: "🐶" },
        { text: "котёнок", emoji: "🐱" },
        { text: "телёнок", emoji: "🐮" }
      ],
      emoji: "🐶",
      audioPrompt: "У собаки родился маленький щенок. Повтори: щенок!"
    },
    {
      id: 4,
      sentence: "Когда идёт дождь, я надеваю _____.",
      correctAnswer: "плащ",
      targetWord: "плащ",
      options: [
        { text: "плащ", emoji: "🧥" },
        { text: "куртку", emoji: "🧥" },
        { text: "шубу", emoji: "🧥" }
      ],
      emoji: "🧥",
      audioPrompt: "Когда идёт дождь, я надеваю плащ. Повтори: плащ!"
    }
  ]
};

export const getSentences = (soundId) => {
  return sentences[soundId] || [];
};
