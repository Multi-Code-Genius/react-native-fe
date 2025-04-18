import React from 'react';
import {Text, View} from 'react-native';
import ActionSheet, {useSheetRef} from 'react-native-actions-sheet';
import {Button} from 'react-native-paper';

function TestScreen() {
  const ref = useSheetRef('return-data');

  return (
    <View>
      <Button onPress={() => ref.current.show()}>Open Sheet</Button>
      <ActionSheet
        indicatorStyle={{
          marginTop: 10,
          width: 150,
        }}
        gestureEnabled
        drawUnderStatusBar>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingHorizontal: 12,
            paddingTop: 20,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 30,
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Are you sure you want to star react-native-actions-sheet repo on
            Github?
          </Text>
        </View>
      </ActionSheet>
    </View>
  );
}

export default TestScreen;
