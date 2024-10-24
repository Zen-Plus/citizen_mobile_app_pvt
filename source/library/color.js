import chroma from 'chroma-js';

const primary = '#0152A6';
const primaryComplementary = '#FDF0D9';
const secondary = '#EF7BAE';
const secondaryComplementary = '#FBECF9';
const gray900 = '#4c4c4c';
const gray700 = '#b2b2b2';
const gray200 = '#F3F2F0';
const gray50 = 'rgba(122, 122, 122, 0.5)';
const dark = '#404040';
const gray50trans = 'rgba(250, 250, 250, 0.6)';
const gray900trans = 'rgba(32, 30, 30, 0.6)';
const white = '#fff';
const stepperBorderWhite = '#fef5ec';
const primaryTrans = 'rgba(255, 164, 0, 0.5)';
const darkBlackTrans = 'rgba(1, 1, 1, 0.5)';
const black = '#000';
const greyishBrownTwo = '#404040';
const lightGrey = '#999999';
const lightGrey2 = '#f1f1f1';
const lightGrey3 = '#fbfbfb';
const lightGrey4 = '#f0f0f0';
const lightGrey5 = '#CECECE';
const lightGrey6 = '#B1B1B1';
const lightGrey7 = '#E9E9E9';
const shadowColor = '#171717';
const darkBlue = '#152d4e';
const green = '#60db91';
const darkGreen = '#41A062';
const darkGreen2 = '#156330';
const black50 = '#222222';
const purple = '#5b0034';
const brightPink = '#ff50b5';
const grayDate = '#aeb2b4';
const blueTitle = '#0c3653';
const readMoreLink = '#ff2ea6';
const transparent = 'rgba(0, 0, 0, 0.2)';
const pureTransparent = 'transparent';
const pinkBg = 'rgba(239, 123, 174, 0.05)';
const lightRed2 = 'rgb(237,48,53)';
const lightRed3 = '#F94C66';
const lightRed4 = '#DB4840';
const frogGreen = 'rgb(96,219,145)';
const lightGreen = 'rgba(96,219,145,0.2)';
const lightGreen1 = 'rgba(65, 160, 98, 0.2)';
const lightRed = 'rgba(237,48,53,0.12)';
const shadow = 'rgba(0,0,0,0.06)';
const lightSalmon = '#fca7a5';
const butterscotch = '#f9bb4b';
const hyperlink = '#0000EE';
const steelgray = '#646464';
const bgcolor = '#EBF2EE';
const gray93 = '#EDEDED';
const secondaryGreen = '#2A7A46';
const gray97 = '#F7F7F7';
const gray87 = '#DEDEDE';
const mediumLightGray = '#AAAAAA';
const secondaryGray = '#595454';
const greenPea = '#2A7A46';
const yellowLight = '#F9F4E7';
const yellowLight2 = '#AF7F01';
const yellowLight3 = '#F9F4E7';
const whiteSmoke = '#EFEFEF';
const charcoal = '#434343';
const purple1 = '#665CA7';
const BlackDark = '#22262A';
const gradientColor = '#309D63';
const gradientColor2 = '#52CC8A';
const greyBackground = '#DEDFDC';
const Black1 = '#22262A';
const tripGray = '#EAE9E9';
const smokeWhite = '#EFEFEF';
const grayWhite = '#FAF8F8';
const darkGreen1 = '#156330';
const lightRed5 = '#B73331';
const LightPink1 = '#41A06233';
const grassGreen = '#478E25';
const grey = '#D9D9D97A';
const justBlack = '#000000';
const Gold = '#AE9042';
const Orchid = '#B6628F';
const DarkSeaGreen = '#4E8376';
const IndianRed = '#C05C57';
const SteelBlue = '#547EBD';
const Silver = '#cfcfcf';
const RoyalBlue = '#3A5CD8';
const Black2 = '#282622';
const LightGray2 = '#EFFEF4';
const light = '#E5E7F1EB';
const SideMenuActiveColor = 'rgba(121, 173, 129, 0.39)';
const PaleBlue = '#E4EBF4';
const DarkGray = '#303030';
const DimGray = '#6E6E6E';
const Red = '#D72D27';
const DarkSlateGray = '#070707';
const LightSkyBlue2 = '#EAF2FA';
const Gainsboro = '#D6D6D6';
const LightGrey7 = '#DDDDDD';
const Charcoal2 = '#343434';
const DimGray2 = '#6A6A6A';
const SlateBlue = '#2754A4';
const DarkGray2 = '#C3C1C1';
const SlateGray = '#33363F';
const LightSlateGray = '#C7CAD0';
const Gray = '#959595';
const DimGray3 = '#616161';
const LightSteelBlue = '#D8E6F5';
const WhiteSmoke1 = '#F6F6F6';
const GhostWhite = '#F8F8F9';
const LightBlue = '#bad0e8';
const LightBlue2 = '#e8f3ff';
const Green2 = '#0FA143';
const Black4 = '#0000004E';
const Black5 = '#00000099';
const Black6 = '#0000002E';

export const colors = {
  Black2,
  light,
  justBlack,
  grey,
  grassGreen,
  LightPink1,
  lightRed5,
  darkGreen1,
  grayWhite,
  primary,
  primaryComplementary,
  secondary,
  secondaryComplementary,
  gray900,
  BlackDark,
  gradientColor,
  gradientColor2,
  greyBackground,
  dark,
  white,
  darkGreen2,
  whiteSmoke,
  gray700,
  black50,
  gray50trans,
  black,
  greyishBrownTwo,
  pinkBg,
  lightRed,
  lightRed2,
  lightRed4,
  darkBlackTrans,
  brightPink,
  grayDate,
  blueTitle,
  readMoreLink,
  stepperBorderWhite,
  primaryTrans,
  purple,
  purple1,
  gray900trans,
  lightGrey,
  lightGrey2,
  lightGrey3,
  darkBlue,
  lightGrey4,
  lightGrey5,
  lightGrey6,
  lightGrey7,
  lightRed3,
  shadowColor,
  hyperlink,
  bgcolor,
  gray93,
  secondaryGreen,
  gray97,
  gray87,
  mediumLightGray,
  greenPea,
  charcoal,
  smokeWhite,
  gray600: chroma.mix(gray200, gray700, 0.8).hex(),
  // (600-200) / (700-200) = 0.8
  // gray600 is 80% of the difference between gray700 and gray200
  gray400: chroma.mix(gray200, gray700, 0.4).hex(),
  // (400-200) / (700-200) = 0.4
  // gray400 is 40% of the difference between gray700 and gray200
  gray200,
  transparent,
  pureTransparent,
  gray50,
  red: '#D72D27',
  green,
  darkGreen,
  yellow: chroma.mix('rgb(255,255,0)', primary, 0.4).hex(),
  yellowLight,
  yellowLight2,
  yellowLight3,
  disabled: chroma(secondary).desaturate(2).luminance(0.5).hex(),
  frogGreen,
  shadow,
  lightGreen,
  lightGreen1,
  lightSalmon,
  butterscotch,
  steelgray,
  Black1,
  tripGray,
  secondaryGray,
  Gold,
  Orchid,
  DarkSeaGreen,
  IndianRed,
  SteelBlue,
  Silver,
  RoyalBlue,
  LightGray2,
  SideMenuActiveColor,
  PaleBlue,
  DarkGray,
  DimGray,
  Red,
  DarkSlateGray,
  LightSkyBlue2,
  Gainsboro,
  LightGrey7,
  Charcoal2,
  DimGray2,
  SlateBlue,
  DarkGray2,
  SlateGray,
  LightSlateGray,
  Gray,
  DimGray3,
  LightSteelBlue,
  WhiteSmoke1,
  GhostWhite,
  LightBlue,
  LightBlue2,
  Green2,
  Black4,
  Black5,
  Black6
};
