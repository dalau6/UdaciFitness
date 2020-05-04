import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';
import { addEntry } from '../actions';
import { removeEntry } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import TextButton from './TextButton';

function EntryDetail({ navigation, metrics, remove, goBack, entryId }) {
  const reset = () => {
    remove();
    goBack();
    removeEntry(entryId);
  };

  return (
    <View style={styles.container}>
      <MetricCard metrics={metrics} />
      <TextButton onPress={reset} style={{ margin: 20 }}>
        RESET
      </TextButton>
    </View>
  );
}

EntryDetail.prototype.navigationOptions = ({ navigation }) => {
  const { entryId } = navigation.state.params;

  const year = entryId.slice(0, 4);
  const month = entryId.slice(5, 7);
  const day = entryId.slice(8);

  return {
    title: `${month}/${day}/${year}`,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
});

function mapStateToProps(state, { navigation }) {
  const { entryId } = navigation.state.params;

  return {
    entryId,
    metrics: state[entryId],
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  const { entryId } = navigation.satte.params;

  return {
    remove: () =>
      dispatch(
        addEntry({
          [entryId]:
            timeToString() === entryId ? getDailyReminderValue() : null,
        })
      ),
    goBack: () => navigation.goBack(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
