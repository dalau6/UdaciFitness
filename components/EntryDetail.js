import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';

function EntryDetail({ navigation, metrics }) {
  return (
    <View style={styles.container}>
      <MetricCard metrics={metrics} />
      <Text>Entry Detail - {navigation.state.params.entryId}</Text>
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

export default connect(mapStateToProps)(EntryDetail);
