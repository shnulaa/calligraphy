import { Artifact } from './types';

export const ARTIFACTS: Artifact[] = [
  {
  id: 'lantingxu',
  title: {
    en: 'Preface to the Poems Composed at the Orchid Pavilion (Shenlong Version)',
    cn: '兰亭序（神龙本）'
  },
  artist: {
    en: 'Wang Xizhi (Copied by Feng Chengsu)',
    cn: '王羲之（冯承素摹）'
  },
  dynasty: {
    en: 'Eastern Jin / Tang Dynasty Copy',
    cn: '晋 / 唐摹本'
  },
  images: [
    '/lantingxu/lantxu_1_3172x1300.jpg',
    '/lantingxu/lantxu_2_3172x1300.jpg',
    '/lantingxu/lantxu_3_3172x1300.jpg',
    '/lantingxu/lantxu_4_3172x1300.jpg',
    '/lantingxu/lantxu_5_3172x1300.jpg',
    '/lantingxu/lantxu_6_3172x1300.jpg',
    '/lantingxu/lantxu_7_3172x1300.jpg',
    '/lantingxu/lantxu_8_3172x1300.jpg',
    '/lantingxu/lantxu_9_3172x1300.jpg'
  ],
  dimensions: { width: 28548, height: 1300 },
  description: {
    en: "Hailed as the 'First Running Script under Heaven', this is the most celebrated calligraphy work in Chinese history. Written by Wang Xizhi during the Orchid Pavilion Gathering in 353 CE. The original was lost, and this 'Shenlong Version' is the finest Tang Dynasty copy by Feng Chengsu.",
    cn: "被誉为\"天下第一行书\"，是中国书法史上最负盛名的作品。王羲之于永和九年（353年）在兰亭雅集时挥毫而就。原作已失传，此\"神龙本\"是唐代冯承素的精摹本，最接近原作神韵。"
  },
  artistBio: {
    en: "Wang Xizhi (303–361), courtesy name Yishao, was a Chinese calligrapher, politician, general and writer during the Jin Dynasty. Born in Linyi, Langya, he served as the General of the Right Army, earning the moniker 'Wang Youjun'. He is universally revered as the 'Sage of Calligraphy'.",
    cn: "王羲之（303–361），字逸少，琅琊临沂人，东晋时期著名书法家、文学家、政治家。曾任右军将军，世称\"王右军\"。他出身名门望族，不仅在书法上登峰造极，在政治和文学上也颇有建树，被后世尊为\"书圣\"。"
  },
  artistAchievement: {
    en: "Revered as the 'Sage of Calligraphy', he revolutionized the art form by mastering all scripts and transforming the rigid styles of the Han and Wei dynasties into the fluid, expressive Running and Cursive scripts. His 'Preface to the Poems Composed at the Orchid Pavilion' is considered the greatest calligraphy work in history, combining perfect technique with profound literary content.",
    cn: "被尊为\"书圣\"。他兼善隶、草、楷、行各体，精研体势，广采众长，备精诸体，冶于一炉，摆脱了汉魏笔风，自成一家，影响深远。其代表作《兰亭序》被誉为\"天下第一行书\"，不仅书法精妙绝伦，文章也是千古名篇，达到了书文合璧的最高境界。"
  },
  background: {
    en: "In the spring of 353 CE (Year 9 of Yonghe), Wang Xizhi gathered 41 literati at the Orchid Pavilion in Shaoxing for a poetry gathering. After drinking wine and composing poems, he wrote this preface in a state of inspired intoxication. Legend says he tried to rewrite it many times but could never match the original's spontaneous perfection. Emperor Taizong of Tang loved it so much that he was buried with the original.",
    cn: "永和九年（353年）三月初三，王羲之与谢安、孙绰等41位名士在会稽山阴（今绍兴）兰亭举行\"修禊\"雅集，众人饮酒赋诗。王羲之酒酣之际，挥毫写下这篇序文。据说他酒醒后多次重写，都无法超越当时的神来之笔。唐太宗李世民极其珍爱此帖，临终时将真迹殉葬昭陵。"
  },
  significance: {
    en: "The Orchid Pavilion Preface represents the pinnacle of Running Script, achieving perfect harmony between technique and spirit. Every character flows naturally, with variations in size, weight, and spacing that create a musical rhythm. The 'Shenlong Version' is the most faithful copy, preserving the original's vitality and elegance. It has been studied and copied by calligraphers for over 1,600 years.",
    cn: "《兰亭序》代表了行书艺术的最高成就，达到了\"天人合一\"的境界。全文324字，字字珠玑，笔法遒媚劲健，章法自然天成。其中20个\"之\"字各不相同，展现了王羲之炉火纯青的技艺。神龙本是现存最接近原作的摹本，保留了原作的神韵和笔意，1600多年来一直是书法学习的最高范本。"
  },
  seals: [
    {
      id: 'seal-shenlong',
      name: { en: 'Shenlong Imperial Seal', cn: '神龙半印' },
      description: { en: 'The famous half-seal of Emperor Zhongzong of Tang, proving this is the authentic Shenlong Version.', cn: '唐中宗"神龙"半印，是鉴定神龙本真伪的重要标志。' },
      x: 2,
      y: 15,
      size: 2.5
    }
  ],
  hotspots: [
    {
      id: 'lt-opening',
      x: 95,
      y: 40,
      title: { en: 'The Famous Opening', cn: '千古名句' },
      content: { en: '"In the ninth year of Yonghe, in late spring..." The opening sets a serene, elegant tone.', cn: '"永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭"。开篇点明时间地点，笔法从容不迫，为全文定下雅致基调。' },
      type: 'history'
    },
    {
      id: 'lt-landscape',
      x: 88,
      y: 45,
      title: { en: 'Landscape Description', cn: '山水之乐' },
      content: { en: '"High peaks and lofty ridges, luxuriant forests and tall bamboos..." Describing the beautiful scenery.', cn: '"此地有崇山峻岭，茂林修竹"。描绘兰亭美景，笔势舒展，如行云流水，展现了魏晋名士的风流潇洒。' },
      type: 'history'
    },
    {
      id: 'lt-twenty-zhi',
      x: 75,
      y: 50,
      title: { en: 'Twenty Different "之"', cn: '二十个"之"字' },
      content: { en: 'The character "之" appears 20 times, each written differently, showcasing supreme mastery.', cn: '全文"之"字出现20次，每个写法都不相同，或大或小，或正或斜，变化万千，是王羲之书法造诣的最佳体现。' },
      type: 'technique'
    },
    {
      id: 'lt-philosophy',
      x: 60,
      y: 45,
      title: { en: 'Life Philosophy', cn: '人生感悟' },
      content: { en: '"Life and death are indeed great matters..." The tone shifts to philosophical contemplation.', cn: '"固知一死生为虚诞，齐彭殇为妄作"。笔锋转向人生哲理，墨色渐浓，笔势渐重，表达了对生命的深刻思考。' },
      type: 'history'
    },
    {
      id: 'lt-emotion',
      x: 45,
      y: 40,
      title: { en: 'Emotional Climax', cn: '情感高潮' },
      content: { en: '"Every time I read the works of the ancients..." Expressing empathy across time.', cn: '"每览昔人兴感之由，若合一契，未尝不临文嗟悼，不能喻之于怀"。情感达到高潮，笔势跌宕，字形变化加剧。' },
      type: 'technique'
    },
    {
      id: 'lt-ending',
      x: 25,
      y: 45,
      title: { en: 'Timeless Ending', cn: '千古绝唱' },
      content: { en: '"Future readers will also feel the same about my words..." A profound ending that transcends time.', cn: '"后之览者，亦将有感于斯文"。结尾回归平和，却意味深长，将个人感慨升华为对人类共同命运的思考，千古传颂。' },
      type: 'history'
    },
    {
      id: 'lt-shenlong',
      x: 10,
      y: 30,
      title: { en: 'Shenlong Half-Seal', cn: '神龙半印' },
      content: { en: 'The famous "Shenlong" half-seal, a key identifier of this version.', cn: '卷首有唐中宗"神龙"年号半印，是鉴定神龙本的重要依据。因摹本装裱时被切去一半，故称"半印"。' },
      type: 'seal'
    }
  ]
},
{
    id: 'kuaixue',
    title: {
      en: 'Timely Clearing After Snowfall',
      cn: '快雪时晴帖'
    },
    artist: {
      en: 'Wang Xizhi',
      cn: '王羲之'
    },
    dynasty: {
      en: 'Eastern Jin Dynasty (303–361)',
      cn: '晋 (303–361)'
    },
    // Reversed order: Leftmost slice (End of scroll) -> Rightmost slice (Start of scroll)
    images: [
      '/kuaixue/17010066.jpg',
      '/kuaixue/17010065.jpg',
      '/kuaixue/17010064.jpg',
      '/kuaixue/17010063.jpg',
      '/kuaixue/17010062.jpg',
      '/kuaixue/17010061.jpg',
      '/kuaixue/17010060.jpg',
      '/kuaixue/17010059.jpg',
      '/kuaixue/17010058.jpg',
      '/kuaixue/17010057.jpg',
      '/kuaixue/17010056.jpg',
      '/kuaixue/17010055.jpg',
      '/kuaixue/17010054.jpg',
      '/kuaixue/17010053.jpg'
    ],
    dimensions: { width: 14000, height: 1000 },
    description: {
      en: "Regarded as the foremost of the 'Three Rarities' by Emperor Qianlong, this letter was written by the Sage of Calligraphy, Wang Xizhi. It expresses his greeting to a friend after a snowfall.",
      cn: "此帖被乾隆皇帝誉为“三希”之首，是“书圣”王羲之在大雪初晴时写给友人的一封信札。全帖笔法圆劲古雅，以此表达对友人的问候及对雪后美景的赞赏。"
    },
    artistBio: {
      en: "Wang Xizhi (303–361), courtesy name Yishao, was a Chinese calligrapher, politician, general and writer during the Jin Dynasty. Born in Linyi, Langya, he served as the General of the Right Army, earning the moniker 'Wang Youjun'.",
      cn: "王羲之（303–361），字逸少，琅琊临沂人，东晋时期著名书法家。曾任右军将军，世称“王右军”。他出身名门望族，不仅在书法上登峰造极，在政治和文学上也颇有建树。"
    },
    artistAchievement: {
      en: "Revered as the 'Sage of Calligraphy', he revolutionized the art form by mastering all scripts and transforming the rigid styles of the Han and Wei dynasties into the fluid, expressive Running and Cursive scripts. His 'Preface to the Poems Composed at the Orchid Pavilion' is considered the greatest calligraphy work in history.",
      cn: "被尊为“书圣”。他兼善隶、草、楷、行各体，精研体势，广采众长，备精诸体，冶于一炉，摆脱了汉魏笔风，自成一家。其代表作《兰亭序》被誉为“天下第一行书”，对中国书法产生了深远的影响。"
    },
    background: {
      en: "Consisting of only 28 characters, this masterpiece is a prime example of Running Script. It was treasured in the 'Hall of Three Rarities' in the Forbidden City.",
      cn: "《快雪时晴帖》全篇仅28字，被誉为“二十八骊珠”。清代乾隆皇帝将其与王献之《中秋帖》、王杰《伯远帖》一同收藏于“三希堂”中，并视为至宝。"
    },
    significance: {
      en: "It represents the pinnacle of Semi-Cursive Script, embodying the 'Middle Way' philosophy—neither too fast nor too slow, displaying a perfect balance of square and round strokes.",
      cn: "此帖代表了行书艺术的极高成就。笔法圆劲古雅，体势平和，展现了王羲之“不激不厉，而风规自远”的中和之美。"
    },
    seals: [
      {
        id: 'seal-qianlong',
        name: { en: 'Qianlong Imperial Seal', cn: '乾隆御览之宝' },
        description: { en: 'Imperial seal of Emperor Qianlong.', cn: '乾隆皇帝鉴赏时留下的御印。' },
        x: 96,
        y: 20,
        size: 3
      }
    ],
    hotspots: [
      {
        id: 'h-shen',
        x: 96.5,
        y: 35,
        title: { en: 'Divine (Shen)', cn: '“神”' },
        content: { en: 'The massive "Spirit" (Shen) character written by Emperor Qianlong, praising the work as divine.', cn: '引首处有乾隆皇帝亲笔题写的巨大“神”字，意指此帖神乎其技，是内府收藏的顶级珍宝。' },
        type: 'seal'
      },
      {
        id: 'h-snow',
        x: 90,
        y: 45,
        title: { en: 'The Character "Snow" (雪)', cn: '“雪”字赏析' },
        content: { en: 'Notice the rounded, fluid stroke.', cn: '注意“雪”字下半部分的圆转，笔法圆润流畅，仿佛展现了瑞雪初融的意境。' },
        type: 'technique'
      },
      {
        id: 'h-greeting',
        x: 85,
        y: 48,
        title: { en: 'Xi Zhi Greetings', cn: '羲之顿首' },
        content: { en: 'Standard letter ending, but written with exquisite rhythm.', cn: '“羲之顿首”是当时书信的常用结语。这四个字写得从容不迫，方圆兼备，位于正文的最左侧。' },
        type: 'history'
      },
      {
        id: 'h-zhao',
        x: 65,
        y: 40,
        title: { en: 'Zhao Mengfu Colophon', cn: '赵孟頫题跋' },
        content: { en: 'The famous colophon by Zhao Mengfu.', cn: '紧接正文之后，有元代大书法家赵孟頫的题跋，称赞其“古雅”，并说“不胜神往”。赵孟頫极力推崇王羲之，此跋本身也是书法珍品。' },
        type: 'history'
      },
      {
        id: 'h-illustration',
        x: 12,
        y: 50,
        title: { en: 'Imperial Illustration', cn: '御制绘图' },
        content: { en: 'Classic Chinese landscape painting accompanying the calligraphy.', cn: '卷尾（最左侧）附有宫廷画师绘制的雪景山水，呼应“快雪时晴”的主题，画风清丽，与书法相得益彰。' },
        type: 'history'
      }
    ]
  },
  {
    id: 'hanshi',
    title: {
      en: 'Poem on the Cold Food Observance',
      cn: '书黄州寒食诗'
    },
    artist: {
      en: 'Su Shi',
      cn: '苏 轼'
    },
    dynasty: {
      en: 'Song Dynasty',
      cn: '宋'
    },
    images: [
      '/hanshi/17010146.jpg',
      '/hanshi/17010145.jpg',
      '/hanshi/17010144.jpg',
      '/hanshi/17010143.jpg',
      '/hanshi/17010142.jpg',
      '/hanshi/17010141.jpg',
      '/hanshi/17010140.jpg',
      '/hanshi/17010139.jpg',
      '/hanshi/17010138.jpg',
      '/hanshi/17010137.jpg',
      '/hanshi/17010136.jpg',
      '/hanshi/17010135.jpg',
      '/hanshi/17010134.jpg',
      '/hanshi/17009562.jpg'
    ],
    dimensions: { width: 19000, height: 1000 },
    description: {
      en: "The 'Third Best Running Script under Heaven'. Written by the poet Su Shi during his exile in Huangzhou.",
      cn: "被誉为“天下第三行书”。是苏东坡被贬黄州第三年的寒食节所作的两首诗。"
    },
    artistBio: {
       en: "Su Shi (1037–1101), also known as Su Dongpo, was a polymath of the Northern Song Dynasty—poet, calligrapher, painter, and statesman. Despite a turbulent political career marked by multiple exiles, he maintained an optimistic and free spirit.",
       cn: "苏轼（1037–1101），字子瞻，号东坡居士，北宋文学家、书画家、美食家。他一生仕途坎坷，多次被贬，但生性豁达，以文会友，在诗、词、散文、书、画等方面均取得了极高的成就。"
    },
    artistAchievement: {
       en: "The leading figure of the 'Four Masters of Song'. He emphasized 'Spirit' (Yi) over strict 'Method' (Fa), advocating for spontaneous expression where the brush follows the mind. He championed the scholar-official style of painting and calligraphy.",
       cn: "位列“宋四家”之首。其书法尚“意”，不拘法度，天真烂漫。主张“我书意造本无法，点画信手烦推求”，开创了宋代“尚意”书风的先河，强调书法应表达作者的真情实感与学问修养。"
    },
    background: {
      en: "It reflects the poet's poverty and depression during exile. The characters vary greatly in size, showing his changing mood.",
      cn: "诗中苍凉沉郁，书法也随之跌宕起伏。字体忽大忽小，笔触或重或轻，如暴风骤雨，充满节奏感。"
    },
    significance: {
      en: "A masterpiece of Song Dynasty calligraphy, which emphasizes 'intent' (Yi) over strict 'structure' (Fa).",
      cn: "苏轼尚“意”，此帖正是宋人“尚意”书风的代表。不仅是书法珍品，也是宋代文学的杰作。"
    },
    seals: [
       {
        id: 'seal-huangzhou',
        name: { en: 'Huangzhou Exile Seal', cn: '黄州团练副使' },
        description: { en: 'A seal indicating his position during exile.', cn: '苏轼贬谪黄州时期的官职印信，见证了这段艰难岁月。' },
        x: 94,
        y: 20,
        size: 3
      }
    ],
    hotspots: [
      {
        id: 'hs-intro',
        x: 92,
        y: 35,
        title: { en: 'The Opening', cn: '自我宽慰' },
        content: { en: 'The script begins with "Self-written poem", relatively calm and balanced.', cn: '起首“自我来黄州，已过三寒食”，字迹尚显平稳，似在叙家常，表现了诗人初时的自我宽慰。' },
        type: 'history'
      },
      {
        id: 'hs-rain',
        x: 82,
        y: 45,
        title: { en: 'Unending Rain', cn: '雨势连绵' },
        content: { en: 'The characters become elongated and slanted.', cn: '“年年欲惜春，春去不容惜”。此处笔势开始连绵，字形拉长，仿佛那令心情压抑的连绵春雨。' },
        type: 'technique'
      },
      {
        id: 'hs-flower',
        x: 76,
        y: 40,
        title: { en: 'Flower in Mud', cn: '卧闻海棠花' },
        content: { en: 'The ink gets heavier and darker.', cn: '“卧闻海棠花，泥污燕支雪”。笔触凝重，墨色浓黑，写出了花落泥涂的无奈，也是自喻身世。' },
        type: 'history'
      },
      {
        id: 'hs-change',
        x: 72,
        y: 50,
        title: { en: 'Emotional Break', cn: '情绪转折' },
        content: { en: 'The spacing becomes irregular.', cn: '第二首诗开始，情绪转激。字距行距变得不规则，显示出诗人内心的动荡。' },
        type: 'technique'
      },
      {
        id: 'hs-ash',
        x: 65,
        y: 55,
        title: { en: 'Dead Ashes', cn: '死灰吹不起' },
        content: { en: 'The climax of despair. Dry brush strokes (Feibai).', cn: '全卷高潮。“死灰吹不起”五字，枯笔飞白，笔势险峻，如干柴烈火，将心如死灰的绝望刻画得入木三分。' },
        type: 'technique'
      },
      {
        id: 'hs-huang',
        x: 50,
        y: 30,
        title: { en: 'Huang Tingjian Colophon', cn: '黄庭坚题跋' },
        content: { en: 'Colophon by Huang Tingjian, another great master.', cn: '苏轼书法的“知音”黄庭坚在卷后题跋，盛赞此帖“试使东坡复为之，未必及此”，认为这是不可复制的杰作。' },
        type: 'history'
      }
    ]
  },
  {
    id: 'jizhi',
    title: {
      en: 'Requiem to His Nephew',
      cn: '祭侄文稿'
    },
    artist: {
      en: 'Yan Zhenqing',
      cn: '颜真卿'
    },
    dynasty: {
      en: 'Tang Dynasty',
      cn: '唐'
    },
    images: [
      '/jizhi/17010207.jpg',
      '/jizhi/17010102.jpg',
      '/jizhi/17010101.jpg',
      '/jizhi/17010100.jpg',
      '/jizhi/17010099.jpg',
      '/jizhi/17010098.jpg',
      '/jizhi/17010097.jpg',
      '/jizhi/17010096.jpg',
      '/jizhi/17010095.jpg',
      '/jizhi/17010094.jpg',
      '/jizhi/17009566.jpg'
    ],
    dimensions: { width: 15000, height: 1000 },
    description: {
      en: "Known as the 'Second Best Running Script under Heaven'. Written in extreme grief after his nephew was killed in the An Lushan Rebellion.",
      cn: "被誉为“天下第二行书”。是颜真卿在安史之乱中，得知侄子颜季明惨遭杀害后，悲愤交加挥泪写下的祭文。"
    },
    artistBio: {
       en: "Yan Zhenqing (709–785) was a leading calligrapher and a loyal governor of the Tang Dynasty. Known for his unyielding moral integrity, he was killed for refusing to surrender to rebel forces, dying a martyr.",
       cn: "颜真卿（709–785），字清臣，唐代名臣、书法家。性格刚烈，为官清正。安史之乱中率军对抗叛军，后奉命宣慰乱军，因坚贞不屈被叛军李希烈缢杀，壮烈殉国。"
    },
    artistAchievement: {
       en: "He created the 'Yan Style' (Yan Ti), characterized by broad, muscular strokes and an upright, monumental structure. His calligraphy broke away from the elegant style of Wang Xizhi, introducing a bold, masculine aesthetic that mirrored his own righteous personality.",
       cn: "创“颜体”，楷书端庄雄伟，行书气势遒劲。他突破了初唐以来专尚二王的风气，开创了宽博宏伟、气象万千的新风格。其书风与其人格高度统一，是“字如其人”的最佳典范，与柳公权并称“颜柳”。"
    },
    background: {
      en: "The document is a draft, full of corrections and crossed-out characters, revealing the raw emotion of the calligrapher.",
      cn: "这原本是一篇草稿，文中有多处涂改。正是这种不加修饰的涂抹，真实记录了作者情绪的波动，字字血泪。"
    },
    significance: {
      en: "Artistically, it breaks the rules of perfect composition. The ink dries out (Feibai) as his emotions intensify.",
      cn: "书法由行变草，墨色由润变枯。情绪的宣泄与笔墨的运用达到了完美的统一，是“书为心画”的最高境界。"
    },
    seals: [],
    hotspots: [
       {
        id: 'jz-start',
        x: 92,
        y: 40,
        title: { en: 'Formal Beginning', cn: '强作镇定' },
        content: { en: 'The text starts with a formal date and title, using heavy, calm ink strokes.', cn: '“维乾元元年”，起首标注日期，笔墨尚显沉稳，颜真卿试图压抑内心的悲痛。' },
        type: 'history'
      },
       {
        id: 'jz-correction',
        x: 65,
        y: 35,
        title: { en: 'Ink Blobs', cn: '涂抹修改' },
        content: { en: 'Correcting "father trapped, son died". The heavy blotting shows his agitation.', cn: '此处提到“父陷子死”，作者情绪激动，笔墨涂抹严重，可见当时心如刀绞，无法平静。' },
        type: 'history'
      },
      {
        id: 'jz-speed',
        x: 45,
        y: 45,
        title: { en: 'Acceleration', cn: '笔势加快' },
        content: { en: 'The script transitions from Running to Cursive.', cn: '随着悲情涌动，行笔速度越来越快，字与字之间牵丝连带，由于泪眼模糊，字形也开始歪斜。' },
        type: 'technique'
      },
      {
        id: 'jz-dry',
        x: 22,
        y: 45,
        title: { en: 'Dry Cry', cn: '呜呼哀哉' },
        content: { en: 'The final exclamation. The ink is completely dry, the brush splits.', cn: '结尾“呜呼哀哉”，墨已枯竭，笔锋散乱。这不仅仅是书写，而是作者发自灵魂深处的恸哭。' },
        type: 'technique'
      }
    ]
  }
];

export const INITIAL_ZOOM = 1;
export const MAX_ZOOM = 8;
export const MIN_ZOOM = 0.5;