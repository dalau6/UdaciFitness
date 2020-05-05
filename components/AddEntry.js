import * as React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
  clearLocalNotification,
  setLocalNotification,
} from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { white, purple } from '../utils/colors';
import { NavigationActions } from 'react-navigation';

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
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

function AddEntry({ alreadyLogged, dispatch, navigation }) {
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

    toHome();

    submitEntry({ key, entry });

    clearLocalNotification().then(setLocalNotification);
  };

  const reset = () => {
    const key = timeToString();

    dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    toHome();

    removeEntry(key);
  };

  const toHome = () => {
    NavigationActions.dispatch(
      NavigationActions.back({
        key: 'AddEntry',
      })
    );
  };

  if (alreadyLogged) {
    return (
      <View style={styles.center}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
          size={100}
        />
        <Text>You already logged your information for today</Text>
        <TextButton style={{ padding: 10 }} onPress={reset}>
          Reset
        </TextButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DateHeader date={new Date().toLocaleString()} />
      {Object.keys(metaInfo).map((key) => {
        const { getIcon, type, ...rest } = metaInfo[key];
        const value = state[key];

        return (
          <View key={key} style={styles.row}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
  },
});

function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === undefined,
  };
}

export default connect(mapStateToProps)(AddEntry);
