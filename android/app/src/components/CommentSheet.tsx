// CommentSheet.tsx
import React, {forwardRef, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

type CommentSheetProps = {};

const CommentSheet = forwardRef<BottomSheetMethods, CommentSheetProps>(
  (props, ref) => {
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    return (
      <BottomSheet ref={ref} index={-1} snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>Comments</Text>
          {/* Map comments here or show comment input */}
        </View>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CommentSheet;
