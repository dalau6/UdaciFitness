import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Live() {
  const [coords, useCoords] = React.useState(null);
  const [status, useStatus] = React.useState(null);
  const [direction, useDirection] = React.useState('');

  if (status === null) {
    return <ActivityIndicator style={{ marginTop: 30 }} />;
  }

  if (status === 'denied') {
    return (
      <View>
        <Text>Denied</Text>
      </View>
    );
  }

  if (status === 'undetermined') {
    return (
      <View>
        <Text>undetermined</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Live</Text>
      <Text>{JSON.stringify(state)}</Text>
    </View>
  );
}
