/**
 * 品牌与产品命名的唯一来源。
 * 改名只需改这个文件，全站文案随之生效。
 * 注意：中文品牌名待商标检索，暂不启用；对外统一使用英文名 + 中文品类描述。
 */
const headline = '让 AI 温故，让组织知新。'
const promise = '知识不出企业的门，资产越用越厚。'

export const BRAND = {
  name: 'KnowVeil',
  email: 'hello@knowveil.ai',
  tagline: '知识有据，能力有章。',
  headline,
  promise,
  claim: `${headline}${promise}`,
  kicker: 'Scale up knowledge through use',
}

/** motto：产品在主句「让 AI 温故，让组织知新」里承担的那一半 */
export const PRODUCTS = {
  skill: {
    name: 'SkillNavigator',
    kind: 'Skill 的审查与分发',
    motto: '知新',
    line: '让每一个进入企业的 AI 能力，都有出处、有审查、有记录。',
  },
  knode: {
    name: 'Knode',
    kind: '本地知识底账',
    motto: '温故',
    line: '让 AI 读得到你的知识，而知识不出你的边界。',
  },
}
