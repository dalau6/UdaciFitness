import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { receiveEntries, addEntry } from '../utils/helpers';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api';
import UdaciFitnessCalendar from 'udacifitness-calendar';

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

  const renderItem = ({ today, ...entries }, formattedDate, key) => (
    <View>
      {today ? (
        <Text>{JSON.stringify(today)}</Text>
      ) : (
        <Text>{JSON.stringify(metrics)}</Text>
      )}
    </View>
  );

  const renderEmptyDate = (formattedDate) => (
    <View>
      <Text>No Data for this day</Text>
    </View>
  );

  return (
    <UdaciFitnessCalendar
      items={entries}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
    />
  );
}

function mapStateToProps(entries) {
  entries;
}

export default connect(mapStateToProps)(History);
