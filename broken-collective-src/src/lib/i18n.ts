import type { Lang } from './book'

const he = {
  'book.title': 'קולקטיב שבור',
  'book.titleOther': 'Broken Collective',
  'book.author': 'מאור הראל',
  'book.tagline': 'ים אחד. שני חופים. חוט אדום אחד.',
  'book.pitch':
    'שלושה צעירים – לוחם משוחרר מיפו, אחותו בת השש־עשרה, ונער ממחנה שאטי בעזה – וחמש שנים שבהן העולם נסדק: מגפה, מחאות, מלחמה. ביניהם רק חוט דק של כדורגל, אהבה וחירות.',
  'book.free': 'קריאה חופשית. עונה אחר עונה.',
  'nav.home': 'הספר',
  'nav.read': 'להתחיל לקרוא',
  'nav.continue': 'להמשיך מאיפה שעצרת',
  'nav.contents': 'תוכן העניינים',
  'nav.about': 'על הספר',
  'nav.langSwitch': 'English',
  'nav.langSwitchLabel': 'Read this page in English',
  'nav.prev': 'הפרק הקודם',
  'nav.next': 'הפרק הבא',
  'nav.backToBook': 'חזרה לספר',
  'nav.skip': 'דילוג לתוכן',
  'prologue.title': 'מבוא',
  'season.label': 'עונה',
  'season.2020.title': 'השנה שבה העולם עצר',
  'season.2021.title': 'שנה של בריחות',
  'season.2022.title': 'השנה שבה הבית התפרק',
  'season.editing': 'בעריכה – בקרוב',
  'season.chapters': 'פרקים',
  'chapter.label': 'פרק',
  'chapter.minutes': '{n} דק׳ קריאה',
  'chapter.end': 'סוף הפרק',
  'chapter.seasonEnd': 'סוף עונת {year}. העונה הבאה בעריכה.',
  'chapter.seasonDone': 'סוף עונת {year}.',
  'chars.title': 'הדמויות',
  'chars.alex.name': 'אלכס',
  'chars.alex.line': 'לוחם גולני משוחרר, אולטראס של הפועל, מאמין רק בחופש של עצמו.',
  'chars.natalie.name': 'נטלי',
  'chars.natalie.line': 'בת שש־עשרה בסגר. מרדנית שקטה שמחפשת גבול לבעוט בו.',
  'chars.mehran.name': 'מהראן',
  'chars.mehran.line': 'נער ממחנה שאטי. מתמטיקה, חלומות על מכונות, ואהבה סודית לאדום.',
  'tools.label': 'הגדרות קריאה',
  'tools.size': 'גודל טקסט',
  'tools.smaller': 'הקטנת טקסט',
  'tools.larger': 'הגדלת טקסט',
  'tools.theme': 'מצב קריאה',
  'tools.paper': 'נייר',
  'tools.night': 'לילה',
  'tools.share': 'שיתוף',
  'tools.copied': 'הקישור הועתק',
  'tools.progress': 'התקדמות בקריאה',
  'about.title': 'על הספר',
  'about.body1':
    'קולקטיב שבור הוא רומן. הוא נכתב לאורך השנים 2020–2025, תוך כדי שהאירועים שהוא מתאר התרחשו. כל עונה היא שנה, וכל פרק לוכד רגע שבו העולם זז על צירו.',
  'about.body2':
    'הדמויות המרכזיות והעלילה הן פרי דמיון. הספר מתרחש על רקע אירועים אמיתיים ומזכיר אישי ציבור; התיאור שלהם משקף את נקודת המבט של הדמויות, ואינו מתיימר להיות תיעוד היסטורי.',
  'about.body3': 'הספר מתפרסם כאן בחינם, בעברית ובאנגלית, עונה אחר עונה.',
  'about.rights': '© {year} מאור הראל. כל הזכויות שמורות.',
  'credit.label': 'הספר עוצב ונבנה ב־',
  'credit.aria': 'Dubel Team – הספר עוצב ונבנה ב־Dubel Team (נפתח בלשונית חדשה)',
  'meta.description':
    'קולקטיב שבור – רומן מאת מאור הראל. שלושה צעירים, שני צדי הגדר, חמש שנים שבהן העולם נסדק. לקריאה חופשית בעברית ובאנגלית.',
} as const

type Key = keyof typeof he
type Dict = Record<Key, string>

const en: Dict = {
  'book.title': 'Broken Collective',
  'book.titleOther': 'קולקטיב שבור',
  'book.author': 'Maor Harel',
  'book.tagline': 'One sea. Two shores. One red thread.',
  'book.pitch':
    'Three young people – a discharged soldier in Jaffa, his sixteen-year-old sister, and a boy from Gaza’s Shati camp – and five years in which the world cracked: a pandemic, protest, war. Between them, only a thin thread of football, love and freedom.',
  'book.free': 'Free to read. One season at a time.',
  'nav.home': 'The book',
  'nav.read': 'Start reading',
  'nav.continue': 'Continue where you left off',
  'nav.contents': 'Contents',
  'nav.about': 'About',
  'nav.langSwitch': 'עברית',
  'nav.langSwitchLabel': 'קריאת העמוד הזה בעברית',
  'nav.prev': 'Previous chapter',
  'nav.next': 'Next chapter',
  'nav.backToBook': 'Back to the book',
  'nav.skip': 'Skip to content',
  'prologue.title': 'Prologue',
  'season.label': 'Season',
  'season.2020.title': 'The Year the World Stopped',
  'season.2021.title': 'A Year of Escapes',
  'season.2022.title': 'The Year the House Came Apart',
  'season.editing': 'In editing – coming soon',
  'season.chapters': 'chapters',
  'chapter.label': 'Chapter',
  'chapter.minutes': '{n} min read',
  'chapter.end': 'End of chapter',
  'chapter.seasonEnd': 'End of season {year}. The next season is in editing.',
  'chapter.seasonDone': 'End of season {year}.',
  'chars.title': 'The characters',
  'chars.alex.name': 'Alex',
  'chars.alex.line': 'Discharged Golani soldier, Hapoel ultra, believer only in his own freedom.',
  'chars.natalie.name': 'Natalie',
  'chars.natalie.line': 'Sixteen, in lockdown. A quiet rebel looking for a boundary to kick.',
  'chars.mehran.name': 'Mehran',
  'chars.mehran.line': 'A boy from the Shati camp. Maths, dreams of machines, and a secret love for red.',
  'tools.label': 'Reading settings',
  'tools.size': 'Text size',
  'tools.smaller': 'Smaller text',
  'tools.larger': 'Larger text',
  'tools.theme': 'Reading mode',
  'tools.paper': 'Paper',
  'tools.night': 'Night',
  'tools.share': 'Share',
  'tools.copied': 'Link copied',
  'tools.progress': 'Reading progress',
  'about.title': 'About the book',
  'about.body1':
    'Broken Collective is a novel. It was written across 2020–2025, while the events it describes were happening. Each season is a year, and each chapter captures a moment when the world shifted on its axis.',
  'about.body2':
    'The main characters and the plot are fiction. The book is set against real events and mentions public figures; how they are portrayed reflects the characters’ points of view and does not claim to be a historical record.',
  'about.body3': 'The book is published here for free, in Hebrew and English, one season at a time.',
  'about.rights': '© {year} Maor Harel. All rights reserved.',
  'credit.label': 'Book designed and built by',
  'credit.aria': 'Dubel Team – book designed and built by Dubel Team (opens in a new tab)',
  'meta.description':
    'Broken Collective – a novel by Maor Harel. Three young people, two sides of a fence, five years in which the world cracked. Free to read in Hebrew and English.',
}

const dicts: Record<Lang, Dict> = { he, en }

export function t(lang: Lang, key: Key, vars?: Record<string, string | number>): string {
  let s: string = dicts[lang][key]
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
  return s
}

export function seasonTitle(lang: Lang, year: number): string | null {
  const key = `season.${year}.title` as Key
  return key in dicts[lang] ? dicts[lang][key] : null
}

export type { Key as I18nKey }
