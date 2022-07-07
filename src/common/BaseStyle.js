import {Platform} from 'react-native';
const BaseStyle = {
  SHADOW_STYLE: {
    ...Platform.select({
      android: {},
      ios: {
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 20,
        shadowColor: 'rgba(0,0,0,0.04)',
      },
    }),
  },
};

export default BaseStyle;