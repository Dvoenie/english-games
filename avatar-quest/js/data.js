// Avatar Quest: Book of Water — контент игры.
// Сцены пересказаны своими словами (B1+), цитаты — только очень короткие, с номером серии.
// Номер серии = Книга 1 (Water), эпизоды 1–20.

window.AQ_DATA = {
  elements: {
    water: { name: "Water", ru: "Лексика", icon: "💧", color: "#3BA7E0", desc: "Phrasal verbs & idioms" },
    earth: { name: "Earth", ru: "Грамматика", icon: "🗻", color: "#6BBF59", desc: "Wishes & conditionals" },
    fire:  { name: "Fire",  ru: "Спор на время", icon: "🔥", color: "#F2603A", desc: "Timed debate" },
    air:   { name: "Air",   ru: "Сцена и обсуждение", icon: "🌪", color: "#E9C46A", desc: "Scene talk & role-play" }
  },

  // Банк фраз для говорения (показывается в споре и интервью)
  phraseBank: {
    opinion: ["In my view, ...", "I'm convinced that ...", "As far as I'm concerned, ...", "I'd argue that ..."],
    contrast: ["On the other hand, ...", "That said, ...", "I see your point, but ...", "Even so, ..."],
    example: ["Take ... for example.", "A good case in point is ...", "This reminds me of ..."],
    hedge: ["It depends on ...", "To some extent, ...", "I'm in two minds about it.", "It's not black and white."],
    conclude: ["All things considered, ...", "At the end of the day, ...", "So, on balance, ..."]
  },

  home: { bg: "img/home.webp", grad: ["#0B2545", "#8DA9C4"] },

  chapters: [
    {
      id: "south",
      title: "The Southern Water Tribe",
      episodes: "Episodes 1–2",
      bg: "img/ch1-south.webp",
      grad: ["#0B2545", "#8DA9C4"],
      theme: "Hope after a long darkness",
      scene: {
        episode: "Ep. 1 «The Boy in the Iceberg»",
        clipHint: "Покажите момент, где Катара и Сокка находят айсберг и из него выходит мальчик (первые ~5 минут серии).",
        quote: { text: "Water. Earth. Fire. Air.", who: "Katara, opening narration" },
        summary: "Two teenagers from a small, poor village at the South Pole find a boy frozen inside an iceberg. When he breaks out, he is cheerful, curious and completely unaware that a hundred years have passed. While he was asleep, a war started, and his whole world changed.",
        questions: [
          "Why do you think the village is so small and poor? What has the war taken from them?",
          "Aang is cheerful and playful. Katara is hopeful. Sokka is suspicious. Which of the three are you most like?",
          "Have you ever come back somewhere after a long time and found that everything had changed?"
        ]
      },
      vocab: [
        { term: "break out (of)", def: "to escape from a place or situation", ex: "Aang breaks out of the iceberg after a hundred years.", you: "Have you ever wanted to break out of your daily routine? What did you do?" },
        { term: "set off", def: "to start a journey", ex: "Katara and Sokka set off with Aang to find a waterbending teacher.", you: "Tell me about the last time you set off on a trip. Where did you go?" },
        { term: "look up to someone", def: "to admire and respect someone", ex: "Katara looks up to her mother, who she lost in the war.", you: "Who did you look up to when you were a teenager? Why?" },
        { term: "out of the blue", def: "suddenly and unexpectedly", ex: "Out of the blue, a boy appears from the ice.", you: "Has anything good ever happened to you out of the blue?" }
      ],
      grammar: [
        { type: "wish (present)", situation: "Katara is the only waterbender in her tribe. Nobody can teach her.", options: ["Katara wishes she had a teacher.", "Katara wishes she has a teacher.", "Katara wishes she will have a teacher."], answer: 0, rule: "wish + Past Simple: хотим, чтобы настоящее было другим.", you: "What do you wish you could do right now that you can't?" },
        { type: "mixed conditional", situation: "Aang was frozen for 100 years. Now he doesn't know the world.", options: ["If Aang hadn't been frozen, he would know what happened in the war.", "If Aang wasn't frozen, he would have known the war.", "If Aang hadn't been frozen, he would have know the war now."], answer: 0, rule: "Mixed: If + Past Perfect (прошлое) → would + V (результат сейчас).", you: "Finish the sentence: If I hadn't started learning English, I would ... now." },
        { type: "2nd conditional", situation: "Imagine you woke up 100 years in the future.", options: ["If I woke up in 2126, the first thing I would do is ...", "If I wake up in 2126, I would do ...", "If I would wake up in 2126, I will ..."], answer: 0, rule: "2nd: If + Past Simple → would + V (нереальное настоящее/будущее).", you: "If you woke up 100 years from now, what would you miss most?" }
      ],
      debate: { motion: "It's wiser to trust strangers than to be suspicious of them.", forHint: "Katara: without trust, nothing good happens.", againstHint: "Sokka: in a war, suspicion keeps people alive." },
      roleplay: {
        character: "Sokka",
        brief: "You are Sokka, 15. You are the oldest boy left in the village and you feel responsible for everyone.",
        questions: ["How do you feel about being the 'man of the village' at fifteen?", "Why didn't you trust Aang at first?", "What do you miss most about your father?", "What would you do if the Fire Nation came back tomorrow?", "What do you wish your sister understood about you?"]
      }
    },

    {
      id: "airtemple",
      title: "The Southern Air Temple",
      episodes: "Episode 3",
      bg: "img/ch2-temple.webp",
      grad: ["#3A2E39", "#F4D6A0"],
      theme: "Facing a painful truth",
      scene: {
        episode: "Ep. 3 «The Southern Air Temple»",
        clipHint: "Покажите, как Аанг возвращается в храм и понимает, что произошло с монахами (вторая половина серии).",
        quote: null,
        summary: "Aang takes his new friends to his home, a temple high in the mountains. He expects to see the monks who raised him. Katara already suspects the truth but can't find a way to tell him. Slowly Aang realises that his people are gone, and his grief turns into a power he cannot control.",
        questions: [
          "Katara knows the truth but hides it. Was that kind or was it a mistake?",
          "How do people usually react when they lose something important? Is anger a natural part of grief?",
          "Is there a place from your childhood that means a lot to you? What would you feel if it disappeared?"
        ]
      },
      vocab: [
        { term: "come to terms with", def: "to slowly accept something sad or difficult", ex: "Aang has to come to terms with the loss of his people.", you: "What is something people often find hard to come to terms with?" },
        { term: "break the news", def: "to tell someone bad news", ex: "Katara doesn't know how to break the news to Aang.", you: "What's the best way to break bad news to a friend?" },
        { term: "fall apart", def: "to lose control of your emotions; to stop working", ex: "When Aang sees the truth, he falls apart.", you: "What helps you when you feel like you're falling apart?" },
        { term: "lose your temper", def: "to suddenly become very angry", ex: "Aang loses his temper, and the wind goes wild.", you: "When did you last lose your temper? What happened?" }
      ],
      grammar: [
        { type: "wish (past)", situation: "Aang left the temple 100 years ago. He wasn't there when the attack happened.", options: ["Aang wishes he hadn't left the temple.", "Aang wishes he didn't leave the temple.", "Aang wishes he wouldn't leave the temple."], answer: 0, rule: "wish + Past Perfect: сожаление о прошлом.", you: "Tell me one thing you wish you had done differently at school." },
        { type: "3rd conditional", situation: "Katara hid the truth. Aang found out alone and lost control.", options: ["If Katara had told him earlier, he might have reacted more calmly.", "If Katara told him earlier, he would react more calmly.", "If Katara would have told him, he had reacted calmly."], answer: 0, rule: "3rd: If + Past Perfect → would/might have + V3 (нереальное прошлое).", you: "Think of a time someone told you something too late. If they had told you earlier, what would have happened?" },
        { type: "if only", situation: "Aang finds his teacher's old things in the temple.", options: ["If only I could talk to him one more time.", "If only I can talk to him one more time.", "If only I will talk to him one more time."], answer: 0, rule: "If only = I wish, но эмоциональнее.", you: "Finish: If only I could ... (something you really want)." }
      ],
      debate: { motion: "It's better to know a painful truth than to live with a comforting lie.", forHint: "Truth lets you grieve and move on.", againstHint: "Sometimes the truth only hurts and changes nothing." },
      roleplay: {
        character: "Aang",
        brief: "You are Aang, 12. You have just found out that your people are gone. You are trying to stay positive.",
        questions: ["What was your life in the temple like?", "Why did you run away a hundred years ago?", "How do you feel about Katara for not telling you?", "What keeps you going now?", "If you could say one thing to your old teacher, what would it be?"]
      }
    },

    {
      id: "kyoshi",
      title: "Kyoshi Island",
      episodes: "Episode 4",
      bg: "img/ch3-kyoshi.webp",
      grad: ["#1D3557", "#E9A6A6"],
      theme: "Pride, stereotypes and respect",
      scene: {
        episode: "Ep. 4 «The Warriors of Kyoshi»",
        clipHint: "Покажите момент, где Сокка приходит тренироваться к девушкам-воинам и проигрывает им (середина серии).",
        quote: null,
        summary: "On a peaceful island, the team is captured by a group of skilled fighters, who all turn out to be girls. Sokka is sure that girls can't be real warriors, until their leader, Suki, easily defeats him. To learn from them, he has to swallow his pride and even wear their traditional uniform.",
        questions: [
          "Why was it so hard for Sokka to accept that girls could fight better than him?",
          "What stereotypes about men and women still exist in your country? Are they changing?",
          "Have you ever had to learn something from someone you didn't expect to learn from?"
        ]
      },
      vocab: [
        { term: "show off", def: "to try to impress people with what you can do", ex: "Aang shows off his tricks to the girls of the island.", you: "Do you know someone who likes to show off? How do people react?" },
        { term: "look down on someone", def: "to think you are better than someone", ex: "At first, Sokka looks down on the female warriors.", you: "Why do some people look down on others? Give an example." },
        { term: "swallow your pride", def: "to do something embarrassing because it's the right thing", ex: "Sokka swallows his pride and asks Suki to teach him.", you: "Tell me about a time you had to swallow your pride." },
        { term: "take something back", def: "to admit that what you said was wrong", ex: "Sokka takes back what he said about girls.", you: "Is there something you said once that you would like to take back?" }
      ],
      grammar: [
        { type: "wish + would", situation: "Suki is annoyed because Sokka keeps making jokes about girls.", options: ["Suki wishes Sokka would stop making those jokes.", "Suki wishes Sokka stops making those jokes.", "Suki wishes Sokka will stop making those jokes."], answer: 0, rule: "wish + would: раздражение от чужого поведения.", you: "Tell me something you wish people around you would stop doing." },
        { type: "2nd conditional", situation: "You are Sokka's friend. Give him advice.", options: ["If I were you, I'd apologise to Suki.", "If I was you, I will apologise to Suki.", "If I am you, I would apologise to Suki."], answer: 0, rule: "If I were you, I'd ... — классика для совета.", you: "Give me advice: I want to learn English faster. If you were me, what would you do?" },
        { type: "3rd conditional", situation: "Sokka asked for training and became a better fighter.", options: ["If he hadn't swallowed his pride, he wouldn't have learned so much.", "If he didn't swallow his pride, he won't learn so much.", "If he hadn't swallowed his pride, he wouldn't learn so much yesterday."], answer: 0, rule: "3rd: If + had + V3 → wouldn't have + V3.", you: "Think of a skill you have. If you hadn't ..., you wouldn't have ..." }
      ],
      debate: { motion: "Some jobs are naturally better suited to men or to women.", forHint: "Physical differences and traditions matter.", againstHint: "Kyoshi warriors: skill, not gender, decides." },
      roleplay: {
        character: "Suki",
        brief: "You are Suki, the leader of the island's warriors. You are confident and protective of your home.",
        questions: ["What did you think of Sokka when you first met him?", "Why do the warriors wear make-up and traditional uniforms?", "Did Sokka change your opinion of boys?", "What makes a good leader?", "What would you do if the war reached your island?"]
      }
    },

    {
      id: "forest",
      title: "The Freedom Fighters' Forest",
      episodes: "Episode 10",
      bg: "img/ch4-forest.webp",
      grad: ["#1B3A2B", "#C9B37E"],
      theme: "Does the end justify the means?",
      scene: {
        episode: "Ep. 10 «Jet»",
        clipHint: "Покажите момент, где Сокка узнаёт настоящий план Джета (последняя треть серии).",
        quote: null,
        summary: "In a forest, the friends meet Jet, a charming young rebel who leads a group of orphans against the Fire Nation. Katara is impressed by him. But Sokka discovers that Jet is ready to destroy a whole town, including innocent people, just to defeat the enemy soldiers there.",
        questions: [
          "Why do people, especially young people, follow leaders like Jet?",
          "Jet lost his family in the war. Does that excuse what he planned to do?",
          "How can you tell the difference between a hero and a dangerous fanatic?"
        ]
      },
      vocab: [
        { term: "take advantage of", def: "to use someone or something unfairly for your own benefit", ex: "Jet takes advantage of Katara's trust.", you: "Have you ever felt that someone took advantage of you?" },
        { term: "fall for something", def: "to believe a trick or a lie", ex: "Katara falls for Jet's charm at first.", you: "What kind of scams do people often fall for?" },
        { term: "go too far", def: "to do something more extreme than is acceptable", ex: "Fighting the soldiers is one thing, but Jet goes too far.", you: "When does a joke go too far?" },
        { term: "turn against someone", def: "to stop supporting someone and become their enemy", ex: "Jet's own friend turns against him in the end.", you: "Why might people turn against a leader they once loved?" }
      ],
      grammar: [
        { type: "3rd conditional", situation: "Sokka warned the town in time. The people survived.", options: ["If Sokka hadn't warned them, the town would have been destroyed.", "If Sokka didn't warn them, the town would be destroyed yesterday.", "If Sokka hadn't warned them, the town will be destroyed."], answer: 0, rule: "3rd conditional + пассив: would have been + V3.", you: "Tell me about a lucky moment in your life. If it hadn't happened, ..." },
        { type: "wish (past)", situation: "Katara feels stupid for trusting Jet.", options: ["Katara wishes she hadn't trusted him.", "Katara wishes she didn't trust him yesterday.", "Katara wishes she wouldn't trust him."], answer: 0, rule: "wish + had + V3: сожаление о том, что уже случилось.", you: "Tell me about a decision you regret: I wish I hadn't ..." },
        { type: "mixed conditional", situation: "Jet lost his parents as a child. Now he is full of hate.", options: ["If Jet hadn't lost his family, he wouldn't be so full of hate now.", "If Jet didn't lose his family, he wouldn't have been full of hate now.", "If Jet hadn't lost his family, he won't be full of hate."], answer: 0, rule: "Mixed: прошлое → настоящее.", you: "Finish: If I had grown up in another country, I would ... now." }
      ],
      debate: { motion: "The end justifies the means.", forHint: "Jet: in war, there are no clean choices.", againstHint: "Sokka: if you hurt innocent people, you become the enemy." },
      roleplay: {
        character: "Jet",
        brief: "You are Jet, 16, a rebel leader. You truly believe you're the good guy.",
        questions: ["Why did you start fighting the Fire Nation?", "Why do the orphans follow you?", "Do you regret anything you've done?", "What do you think of Sokka?", "If the war ended tomorrow, what would you do with your life?"]
      }
    },

    {
      id: "storm",
      title: "The Storm",
      episodes: "Episodes 12–13",
      bg: "img/ch5-storm.webp",
      grad: ["#14213D", "#5E6472"],
      theme: "Running away, honour and second chances",
      scene: {
        episode: "Ep. 12 «The Storm» · Ep. 13 «The Blue Spirit»",
        clipHint: "Серия 12: две истории прошлого — почему Аанг сбежал и почему изгнали Зуко (флешбэки). Серия 13: финальный разговор Аанга и Зуко в лесу.",
        quote: { text: "You will learn respect, and suffering will be your teacher.", who: "Fire Lord Ozai, Ep. 12" },
        summary: "During a terrible storm, we learn two stories from the past. Aang ran away when he was told he was the Avatar, because the responsibility felt too heavy for a twelve-year-old. Prince Zuko spoke up at a war meeting to protect young soldiers, was punished by his own father and sent away. He can only come home if he captures the Avatar.",
        questions: [
          "Aang and Zuko are enemies, but their stories are similar. In what ways?",
          "Was Zuko wrong to speak up at the meeting? What would you have done?",
          "Is it ever okay to run away from responsibility? When?"
        ]
      },
      vocab: [
        { term: "run away from", def: "to escape a problem instead of dealing with it", ex: "Aang ran away from his duties as the Avatar.", you: "What problems do people often run away from instead of facing them?" },
        { term: "live up to (expectations)", def: "to be as good as people expect", ex: "Zuko is desperate to live up to his father's expectations.", you: "Did you ever feel pressure to live up to your parents' expectations?" },
        { term: "carry the weight of the world on your shoulders", def: "to feel responsible for everything and everyone", ex: "At twelve, Aang carries the weight of the world on his shoulders.", you: "When did you feel you were carrying the weight of the world on your shoulders?" },
        { term: "speak up", def: "to say what you think, especially to protect someone", ex: "Zuko speaks up to save the young soldiers.", you: "Have you ever spoken up when everyone else was silent?" },
        { term: "make up for", def: "to do something good to correct a past mistake", ex: "Aang wants to make up for the hundred years he was gone.", you: "How do people usually try to make up for their mistakes?" }
      ],
      grammar: [
        { type: "wish (past)", situation: "Aang ran away and the war started without him.", options: ["Aang wishes he had stayed and faced his destiny.", "Aang wishes he stayed and faced his destiny.", "Aang wishes he would stay and face his destiny."], answer: 0, rule: "wish + Past Perfect.", you: "If you could go back to age 12, what do you wish you had known?" },
        { type: "mixed conditional", situation: "Zuko spoke up at the meeting and was banished. He is still far from home.", options: ["If Zuko hadn't spoken up, he would still be living in the palace.", "If Zuko didn't speak up, he would have still lived in the palace now.", "If Zuko hadn't spoken up, he will still live in the palace."], answer: 0, rule: "Mixed: If + had + V3 → would + be + -ing (сейчас).", you: "Finish: If I had chosen a different job/university, I would be ... now." },
        { type: "2nd conditional (unreal past/present)", situation: "In Ep. 13, Aang asks Zuko if they could have been friends in another time.", options: ["If we had met a hundred years ago, we could have been friends.", "If we met a hundred years ago, we can be friends.", "If we have met a hundred years ago, we would be friends."], answer: 0, rule: "could have + V3: упущенная возможность в прошлом.", you: "Is there someone you could have been friends with if things had been different?" }
      ],
      debate: { motion: "Aang was right to run away.", forHint: "He was a child. Adults had no right to put the world on him.", againstHint: "Because he ran, a whole nation suffered." },
      roleplay: {
        character: "Zuko",
        brief: "You are Prince Zuko, 16. You were banished by your father. Capturing the Avatar is your only way home.",
        questions: ["Why is your honour so important to you?", "Do you think your father was right to punish you?", "What does your uncle mean to you?", "Do you ever doubt your mission?", "If you had the chance to live a normal life, would you take it?"]
      }
    },

    {
      id: "north",
      title: "The Northern Water Tribe",
      episodes: "Episodes 18–20",
      bg: "img/ch6-north.webp",
      grad: ["#0D1B2A", "#9AD1D4"],
      theme: "Tradition, change and sacrifice",
      scene: {
        episode: "Ep. 18 «The Waterbending Master» · Ep. 20 «The Siege of the North, Part 2»",
        clipHint: "Серия 18: Пакку отказывается учить Катару, и она вызывает его на поединок. Серия 20: решение Юи в финале.",
        quote: null,
        summary: "The friends finally reach a great city of ice, but the master there refuses to teach Katara because, in this tribe, girls are only allowed to learn healing. Katara challenges him to a duel to prove herself. Later, when the city is attacked, Princess Yue has to make a choice that costs her everything in order to save her people.",
        questions: [
          "Why do some communities hold on to traditions even when they are unfair?",
          "Katara challenged the master. Was that brave or disrespectful?",
          "Yue sacrificed herself for her people. Do leaders today make sacrifices like that?"
        ]
      },
      vocab: [
        { term: "stand up for", def: "to defend a person, an idea or your rights", ex: "Katara stands up for her right to learn.", you: "What is something you would always stand up for?" },
        { term: "stick to (tradition / rules)", def: "to continue following something without changing it", ex: "Master Pakku sticks to the old traditions.", you: "Which family traditions do you stick to? Which ones did you drop?" },
        { term: "against all odds", def: "although success seemed very unlikely", ex: "Against all odds, the city survives the attack.", you: "Do you know a story where someone succeeded against all odds?" },
        { term: "step up", def: "to take responsibility when it's needed", ex: "When the moon disappears, Yue steps up.", you: "When did you have to step up at work or in your family?" },
        { term: "give up on", def: "to stop hoping that something or someone will succeed", ex: "Katara refuses to give up on learning waterbending.", you: "Have you ever given up on something and later regretted it?" }
      ],
      grammar: [
        { type: "wish + could", situation: "Katara is told she can only learn healing.", options: ["Katara wishes she could learn to fight.", "Katara wishes she can learn to fight.", "Katara wishes she could have learned to fight tomorrow."], answer: 0, rule: "wish + could: желание иметь возможность.", you: "What do you wish you could change about your city?" },
        { type: "2nd conditional", situation: "The tribe doesn't let women fight.", options: ["If women were allowed to fight, the tribe would be much stronger.", "If women are allowed to fight, the tribe would be stronger.", "If women would be allowed to fight, the tribe will be stronger."], answer: 0, rule: "2nd + пассив: If + were + V3.", you: "If you were the mayor of your city, what rule would you change first?" },
        { type: "3rd conditional", situation: "Katara challenged the master. In the end he agreed to teach her.", options: ["If she hadn't challenged him, he would never have changed his mind.", "If she didn't challenge him, he never changes his mind.", "If she hadn't challenged him, he would never change his mind yesterday."], answer: 0, rule: "3rd conditional.", you: "Think of a time you insisted on something. If you hadn't insisted, ..." }
      ],
      debate: { motion: "Traditions should be changed as soon as they become unfair.", forHint: "Katara: a tradition that hurts people isn't worth keeping.", againstHint: "Pakku: change too fast and you lose who you are." },
      roleplay: {
        character: "Master Pakku",
        brief: "You are Pakku, an old, strict waterbending master. You believe in your tribe's traditions.",
        questions: ["Why did you refuse to teach Katara?", "What made you change your mind?", "Are all traditions worth keeping?", "What did you learn from your student?", "What advice would you give to young people who want to change the rules?"]
      }
    }
  ],

  finale: {
    title: "The Siege of the North",
    bg: "img/finale.webp",
    grad: ["#2B0F0F", "#F2603A"],
    intro: "The Fire Nation fleet has arrived. To protect the city, you need every element you've learned. Answer fast, think clearly — and speak.",
    finalTalk: [
      "If you were the Avatar for one day, what would you change in our world, and why?",
      "Which character's journey in Book 1 is most like yours? Explain.",
      "What is one thing you wish you had done differently this year, and what will you do next year instead?"
    ]
  }
};
