import { Artifact } from './types';

export const KUAIXUE_SHIQING_TIE: Artifact = {
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
    cn: '东晋 (303–361)'
  },
  images: [
    'https://theme.npm.edu.tw/selection/att/collection/04001001/17010053.jpg',
    'https://theme.npm.edu.tw/selection/att/collection/04001001/17010054.jpg',
    'https://theme.npm.edu.tw/selection/att/collection/04001001/17010055.jpg',
    'https://theme.npm.edu.tw/selection/att/collection/04001001/17010056.jpg',
    'https://theme.npm.edu.tw/selection/att/collection/04001001/17010057.jpg'
  ],
  dimensions: { width: 5000, height: 1000 },
  description: {
    en: "Regarded as one of the 'Three Rarities' by Emperor Qianlong, this letter was written by the Sage of Calligraphy, Wang Xizhi, after a snowfall. It expresses his greeting to a friend and praises the beauty of the clear snow.",
    cn: "此帖被乾隆皇帝誉为“三希”之首，是“书圣”王羲之在大雪初晴时写给友人的一封信札。全帖笔法圆劲古雅，以此表达对友人的问候及对雪后美景的赞赏。"
  },
  background: {
    en: "Currently housed in the National Palace Museum in Taipei, 'Timely Clearing After Snowfall' is a short letter written by Wang Xizhi to a friend named Zhang Hou. It consists of only 4 lines and 28 characters. In the Qing Dynasty, Emperor Qianlong treasured this work immensely, building the 'Hall of Three Rarities' (Sanxitang) specifically to house it along with Wang Xianzhi's 'Mid-Autumn Manuscript' and Wang Xun's 'Letter to Boyuan'.",
    cn: "《快雪时晴帖》现藏于台北故宫博物院，是王羲之写给友人张侯（张允之）的一封短信。全篇仅4行28字。清代乾隆皇帝对此帖极度推崇，将其与王献之《中秋帖》、王杰《伯远帖》一同收藏于紫禁城养心殿的“三希堂”中，并视为“三希”之首，常在帖上题跋钤印，可见其喜爱之情。"
  },
  significance: {
    en: "Despite its brevity, this scroll represents the pinnacle of Semi-Cursive Script (Xingshu). The famous Yuan Dynasty calligrapher Zhao Mengfu praised it as having 'Divine Ink Spirit' unmatched by predecessors. The brushwork oscillates between square and round, displaying a rhythm that is neither too fast nor too slow—a perfect embodiment of the 'Middle Way' philosophy in Chinese aesthetics. It is often referred to as 'Twenty-Eight Pearls'.",
    cn: "此帖虽然篇幅短小，却代表了行书艺术的极高成就。元代书法大家赵孟頫赞其“翰墨神气，前人不及”。其笔法圆劲古雅，体势平和，展现了王羲之“不激不厉，而风规自远”的中和之美。每一个字都如珍珠般圆润饱满，章法错落有致，气韵生动，被后世誉为“二十八骊珠”。"
  },
  seals: [
    {
      id: 'seal-qianlong',
      name: { en: 'Qianlong Imperial Seal', cn: '乾隆御览之宝' },
      description: {
        en: 'The "Shen Yun" (Divine Charm) seal applied by Emperor Qianlong, signifying his utmost admiration.',
        cn: '乾隆皇帝鉴赏时留下的御印，特别是“神乎技矣”等题字，象征其对作品的极高评价。'
      },
      x: 85,
      y: 20,
      size: 8
    },
    {
      id: 'seal-sanxi',
      name: { en: 'Hall of Three Rarities', cn: '三希堂精鉴玺' },
      description: {
        en: 'Indicates this work was stored in the Hall of Three Rarities (Sanxitang) in the Forbidden City.',
        cn: '表明此作曾收藏于紫禁城养心殿的“三希堂”中，是清宫最高等级的收藏印记。'
      },
      x: 10,
      y: 60,
      size: 6
    }
  ],
  hotspots: [
    {
      id: 'h1',
      x: 50,
      y: 40,
      title: { en: 'The Character "Snow" (雪)', cn: '“雪”字赏析' },
      content: {
        en: 'Notice the rounded, fluid stroke. Wang Xizhi uses the "Running Script" (Xingshu) here to convey the melting quality of snow.',
        cn: '注意其用笔圆润流畅。王羲之在此处运用行书笔意，笔势连贯，仿佛展现了瑞雪初融的意境。'
      },
      type: 'technique'
    },
    {
      id: 'h2',
      x: 20,
      y: 30,
      title: { en: 'Postscript by Zhao Mengfu', cn: '赵孟頫题跋' },
      content: {
        en: 'Centuries later, the Yuan dynasty master Zhao Mengfu added this colophon, praising the "Dragon-like" energy of the brushwork.',
        cn: '元代书法宗师赵孟頫在卷后题跋，盛赞此帖“古雅圆劲”，称其具有龙跳天门、虎卧凤阁的气势。'
      },
      type: 'history'
    }
  ]
};

export const INITIAL_ZOOM = 1;
export const MAX_ZOOM = 8;
export const MIN_ZOOM = 0.5;