import * as React from 'react';
import { View } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';

export default function AddEntry() {
  return (
    <View style={styles.container}>{getMetricMetaInfo('buke').getIcon()}</View>
  );
}
