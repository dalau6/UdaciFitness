import * as React from 'react';
import { View } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';

function metricReducer(state, action) {
  if (action.type === 'increment') {
    const { key } = action;
    const { max, step } = getMetricMetaInfo(key);
    const count = state.key + step;

    return {
      ...state,
      [key]: count > max ? max : count,
    };
  } else if (action.type === 'decrement') {
    const { key } = action;
    const count = state.key - getMetricMetaInfo(key).step;

    return {
      ...state,
      [key]: count < 0 ? 0 : count,
    };
  } else if (action.type === 'slide') {
    return {
      ...state,
      [key]: action.value,
    };
  } else {
    throw new Error(`That action type isn't supported.`);
  }
}

export default function AddEntry() {
  const [state, dispatch] = React.useReducer(metricReducer, {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  });

  const metaInfo = getMetricMetaInfo();

  return (
    <View>
      {Object.keys(metaInfo).map((key) => {
        const { getIcon, type, ...rest } = metaInfo[key];
        const value = state[key];

        return (
          <View key={key}>
            {getIcon()}
            {type === 'slider' ? (
              <UdaciSlider
                value={value}
                onChange={(value) =>
                  dispatch({ type: 'slide', key, value })
                }
                {...rest}
              />
            ) : (
              <UdaciSteppers
                value={value}
                onIncrement={() => dispatch({ action: 'increment', key})}
                onDecrement={() => dispatch({ action: 'decrement', key})}
                {...rest}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
