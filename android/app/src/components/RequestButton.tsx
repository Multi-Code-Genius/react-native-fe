import React from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {IconButton, Tooltip, useTheme} from 'react-native-paper';

interface Props {
  id: string;
  isAlreadySent: boolean;
  onRequest: (id: string) => void;
}

const RequestButton: React.FC<Props> = ({id, isAlreadySent, onRequest}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={[animatedStyle, {marginLeft: 8}]}>
      <Tooltip title={isAlreadySent ? 'Request Sent!' : 'Send Request'}>
        <IconButton
          icon={isAlreadySent ? 'account-check' : 'account-plus'}
          size={24}
          onPress={() => onRequest(id)}
          onPressIn={() => (scale.value = withSpring(0.9))}
          onPressOut={() => (scale.value = withSpring(1))}
          iconColor={
            isAlreadySent ? theme.colors.secondary : theme.colors.primary
          }
          style={{backgroundColor: theme.colors.surface}}
        />
      </Tooltip>
    </Animated.View>
  );
};

export default RequestButton;
