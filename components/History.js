import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { receiveEntries, addEntry } from '../utils/helpers';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api';

function History({ entries, dispatch }) {
  React.useEffect(() => {
    fetchCalendarResults()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue(),
            })
          );
        }
      });
  }, []);
  return (
    <View>
      <Text>{JSON.stringify(entries)}</Text>
    </View>
  );
}

function mapStateToProps(entries) {
  entries;
}

export default connect(mapStateToProps)(History);
