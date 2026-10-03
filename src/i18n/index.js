import { lang } from './lang.js';
import './da.js';
import './en.js';
import { bindGameLabelResources } from '../game/text/getLabelText.js';

let activeLocale = 'da';

export function setActiveLocale(code) {
  activeLocale = code === 'en' ? 'en' : 'da';
  bindGameLabelResources(lang[activeLocale]);
}

export function getActiveLocale() {
  return activeLocale;
}

export function getActiveStrings() {
  return lang[activeLocale];
}

export function formatString(key, replace0, replace1) {
  let str = lang[activeLocale][key] ?? '';
  if (replace0 != null) str = str.replace('{0}', `${replace0}`);
  if (replace1 != null) str = str.replace('{1}', `${replace1}`);
  return str;
}

setActiveLocale('da');
