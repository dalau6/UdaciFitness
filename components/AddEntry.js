import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
} from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';

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

function AddEntry({ alreadyLogged, dispatch }) {
  const [state, metricDispatch] = React.useReducer(metricReducer, {
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

    dispatch(
      addEntry({
        [key]: entry,
      })
    );

    metricDispatch({ type: 'reset' });

    // Navigate to home

    submitEntry({ key, entry });

    // Clean local notification
  };

  const reset = () => {
    const key = timeToString();

    dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    // Route to Home

    removeEntry(key);
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
                onChange={(value) =>
                  metricDispatch({ type: 'slide', key, value })
                }
                {...rest}
              />
            ) : (
              <UdaciSteppers
                value={value}
                onIncrement={() => metricDispatch({ type: 'increment', key })}
                onDecrement={() => metricDispatch({ type: 'decrement', key })}
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

function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === undefined,
  };
}

export default connect(mapStateToProps)(AddEntry);
