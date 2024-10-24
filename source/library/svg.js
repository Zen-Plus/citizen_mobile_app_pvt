import * as React from 'react';
import Svg, {
  Path,
  G,
  Circle,
  Defs,
  Rect,
  Use,
  Mask,
  Image,
} from 'react-native-svg';
import {colors, scaling, fonts} from './index';
import {colorCodes, vehicleType} from '../constants';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

export const Language = props => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={widthScale(48)}
      height={heightScale(48)}
      viewBox="0 0 48 48"
      {...props}>
      <G fill="none" fillRule="evenodd">
        <Path d="M0 0h48v48H0z" />
        <G fillRule="nonzero">
          <Path
            stroke="#404040"
            strokeWidth={1.5}
            d="M45 3v33H27l-12 9v-9H3V3z"
          />
          <Path
            fill="#404040"
            d="M11.352 26.65l.564-1.77h4.65l.583 1.77h3.833l-4.26-11.866h-4.963L7.5 26.65h3.852zm4.182-4.863h-2.606l.953-2.84c.156-.486.272-.895.35-1.245.097.35.195.759.37 1.245l.933 2.84zm22.683 4.864V15.718h2.043v-2.12h-6.303v2.12h1.518v4.027c-.37.194-.876.33-1.557.33a3.4 3.4 0 01-1.556-.389c-.039-.02-.078-.039-.117-.078h-.02a2.26 2.26 0 00-.66-.233v-.078c.914-.447 1.42-1.4 1.42-2.51 0-1.984-1.518-3.287-3.794-3.287-1.615 0-2.84.74-3.463 1.634l1.712 1.615c.37-.603.895-.973 1.673-.973.837 0 1.362.525 1.362 1.284 0 .875-.486 1.498-1.673 1.498h-.681v2.276h1.05c1.246 0 1.849.506 1.849 1.342 0 .856-.603 1.479-1.634 1.479-1.265 0-2.101-.837-2.51-1.556l-1.887 1.73c.486.72 1.81 2.102 4.358 2.102 2.645 0 4.299-1.615 4.299-3.813v-.117c.292.117.603.195.953.195.33 0 .623-.059.876-.136v4.59h2.742z"
          />
        </G>
      </G>
    </Svg>
  );
};

export const LanguagesSymbol = props => {
  const {lan, iconPath} = props;
  const langauge = lan;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={widthScale(32)}
      height={heightScale(32)}
      viewBox="0 0 32 32"
      {...props}>
      <G fill="none" fillRule="evenodd">
        <Circle cx={16} cy={16} r={16} fill="#E4EBF5" opacity={0.29} />
        <Path d="M7.111 7.111h17.778v17.778H7.111z" />
        <Path fill="#0152A6" fillRule="nonzero" d={iconPath} />
      </G>
    </Svg>
  );
};

/**
 * This is right tick symbol for langauge selected by user
 */
export const LanguageSelected = props => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={widthScale(18)}
      height={heightScale(18)}
      viewBox="0 0 18 18"
      {...props}>
      <Path
        d="M9 0C4.038 0 0 4.037 0 9s4.038 9 9 9 9-4.037 9-9-4.038-9-9-9zm5.017 5.998l-5.538 6.231a.689.689 0 01-.95.081L4.067 9.54a.691.691 0 11.865-1.081l2.949 2.359 5.102-5.74a.692.692 0 111.035.92z"
        fill="#ED3035"
        fillRule="evenodd"
      />
    </Svg>
  );
};
