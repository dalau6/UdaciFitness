import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { reset } from 'expo/build/AR';

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  );
}

function metricReducer(state, action) {
  if (action.type === 'increment') {
    const { key } = action;
    const { max, step } = getMetricMetaInfo(key);
    const count = state[key] + step;

    return {
      ...state,
      [key]: count > max ? max : count,
    };
  } else if (action.type === 'decrement') {
    const { key } = action;
    const count = state[key] - getMetricMetaInfo(key).step;

    return {
      ...state,
      [key]: count < 0 ? 0 : count,
    };
  } else if (action.type === 'slide') {
    return {
      ...state,
      [action.key]: action.value,
    };
  } else if (action.type === 'reset') {
    return {
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
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

  const submit = () => {
    const key = timeToString();
    const entry = state;

    // Update Redux

    dispatch({ type: 'reset' });

    // Navigate to home

    // Save to 'DB'

    // Clean local notification
  };

  const reset = () => {
    const key = timeToString();

    // Update Redux

    // Route to Home

    // Update 'DB'
  };

  if (alreadyLogged) {
    return (
      <View>
        <Ionicons name="md-happy" size={100} />
        <Text>You already logged your information for today</Text>
        <TextButton onPress={reset}>Reset</TextButton>
      </View>
    );
  }

  return (
    <View>
      <DateHeader date={new Date().toLocaleString()} />
      {Object.keys(metaInfo).map((key) => {
        const { getIcon, type, ...rest } = metaInfo[key];
        const value = state[key];

        return (
          <View key={key}>
            {getIcon()}
            {type === 'slider' ? (
              <UdaciSlider
                value={value}
                onChange={(value) => dispatch({ type: 'slide', key, value })}
                {...rest}
              />
            ) : (
              <UdaciSteppers
                value={value}
                onIncrement={() => dispatch({ type: 'increment', key })}
                onDecrement={() => dispatch({ type: 'decrement', key })}
                {...rest}
              />
            )}
          </View>
        );
      })}
      <SubmitBtn onPress={submit} />
    </View>
  );
}
