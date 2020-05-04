import * as React from 'react';
import { View, Text } from 'react-native';

export default function EntryDetail({ navigation }) {
  return (
    <View>
      <Text>Entry Detail - {navigation.state.params.entryId}</Text>
    </View>
  );
}
