import * as React from 'react';
import { View } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';

function metricReducer(state, action) {
  if (action.type === 'increment') {
    const { metric } = action;
    const { max, step } = getMetricMetaInfo(metric);
    const count = state.metric + step;

    return {
      ...state,
      [metric]: count > max ? max : count,
    };
  } else if (action.type === 'decrement') {
    const { metric } = action;
    const count = state.metric - getMetricMetaInfo(metric).step;

    return {
      ...state,
      [metric]: count < 0 ? 0 : count,
    };
  } else if (action.type === 'slide') {
    return {
      ...state,
      [action.metric]: action.value,
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

  return <View>{getMetricMetaInfo('bike').getIcon()}</View>;
}
