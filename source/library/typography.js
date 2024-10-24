import {colors, scaling} from '../library';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

export const fonts = {
  calibri: {
    regular: 'Poppins-Regular',
    bold: 'Poppins-Bold',
    light: 'Poppins-Light',
    italic: 'Poppins-Italic',
    thin: 'Poppins-Thin',
    boldItalic: 'Poppins-BoldItalic',
    lightItalic: 'Poppins-LightItalic',
    extraBold: 'Poppins-ExtraBold',
    extraBoldItalic: 'Poppins-ExtraBoldItalic',
    medium: 'Poppins-Medium',
    mediumItalic: 'Poppins-MediumItalic',
    semiBold: 'Poppins-SemiBold',
    semiBoldItalic: 'Poppins-SemiBoldItalic',
    black: 'Poppins-Black',
    blackItalic: 'Poppins-BlackItalic',
    extraLight: 'Poppins-ExtraLight',
    extraLightItalic: 'Poppins-ExtraLightItalic',
    ThinItalic: 'Poppins-ThinItalic',
  },
};

export const textStyles = {
  title: {
    fontSize: normalize(36),
    lineHeight: heightScale(43),
    fontFamily: fonts.calibri.regular,
    color: colors.gray900,
  },
  headline: {
    fontSize: normalize(20),
    lineHeight: heightScale(25),
    fontFamily: fonts.calibri.semiBold,
    color: colors.gray900,
  },
  body: {
    fontSize: normalize(15),
    lineHeight: heightScale(22),
    fontFamily: fonts.calibri.regular,
    color: colors.gray900,
  },
  caption: {
    fontSize: normalize(12),
    lineHeight: heightScale(16),
    fontFamily: fonts.calibri.regular,
    color: colors.gray900,
  },
};
