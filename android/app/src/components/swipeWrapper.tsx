// components/SwipeWrapper.tsx
import React from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { View, Animated } from 'react-native';

const SwipeWrapper = ({ children, onSwipeLeft }: { children: React.ReactNode; onSwipeLeft: () => void }) => {
  const translationX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX } }],
    { useNativeDriver: true }
  );

  const handleHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX < -20) {
        onSwipeLeft?.();
      }

      Animated.timing(translationX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={handleHandlerStateChange}>
      <Animated.View style={{ flex: 1 }}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default SwipeWrapper;
