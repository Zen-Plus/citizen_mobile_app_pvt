import {findBestAvailableLanguage} from 'react-native-localize';

export const locales = {
  en: require('./en.json'),
  hi: require('./hi.json'),
  or: require('./or.json'),
  gu: require('./gu.json'),
  as: require('./as.json'),
  te: require('./te.json'),
  ta: require('./ta.json'),
  ml: require('./ml.json'),
  kn: require('./kn.json'),
  pu: require('./pu.json'),
};

let currentLanguage;
const defaultLanguageTag = "en";

/**
 * This function sets the current langauge of the app.
 * @param {*} value : current langauge used in the app
 */
export const setPreferredLanguageTag = value => {
  currentLanguage = value
};

/**
 * This function is used to get the current langauge of the app.
 */
export const getPreferredLanguageTag = (
  availableLocales = Object.keys(locales),
) => {
  const { languageTag } = findBestAvailableLanguage(availableLocales) || {}
  return currentLanguage || languageTag || defaultLanguageTag
}
