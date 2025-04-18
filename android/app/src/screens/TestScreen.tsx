import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Text, useTheme} from 'react-native-paper';

const TestScreen = () => {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text>TestScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TestScreen;
