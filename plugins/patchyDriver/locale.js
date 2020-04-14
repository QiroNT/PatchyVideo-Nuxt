const availableLocales = [
  { code: 'zh-Hans', name: '简体中文', pcode: 'CHS' },
  { code: 'zh-Hant', name: '繁體中文', pcode: 'CHT' },
  { code: 'ja', name: '日本語', pcode: 'JPN' },
  { code: 'en-US', name: 'English', pcode: 'ENG' }
]

function getPcode(code) {
  for (const i in availableLocales) {
    if (i.code === code) return i.pcode
  }
  return 'CHS'
}

export default {
  availableLocales,
  getPcode
}
