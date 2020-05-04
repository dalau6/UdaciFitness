import * as React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { purple, white } from '../utils/colors';

export default function Live() {
  const [coords, useCoords] = React.useState(null);
  const [status, useStatus] = React.useState(null);
  const [direction, useDirection] = React.useState('');

  const askPermission = () => {};

  if (status === null) {
    return <ActivityIndicator style={{ marginTop: 30 }} />;
  }

  if (status === 'denied') {
    return (
      <View style={styles.center}>
        <Foundation name="alert" size={50} />
        <Text>
          You denied your location. You can fix this by visiting your settings
          and enabling location services for this app.
        </Text>
      </View>
    );
  }

  if (status === 'undetermined') {
    return (
      <View style={styles.center}>
        <Foundation name="alert" size={50} />
        <Text>You need to enable location services for this app.</Text>
        <TouchableOpacity style={styles.button} onPress={this.askPermission}>
          <Text style={styles.buttonText}>Enable</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    padding: 10,
    backgroundColor: purple,
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  buttonText: {
    color: white,
    fontSize: 20,
  },
});
