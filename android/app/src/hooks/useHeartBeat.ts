import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import axios from 'axios';

export function useHeartbeat(userId: string) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const sendPing = async () => {
    try {
      await axios.post('https://yourserver.com/api/ping', {userId});
      console.log('Ping sent');
    } catch (err) {
      console.error('Ping error:', err);
    }
  };

  const startPinging = () => {
    sendPing();
    intervalRef.current = setInterval(sendPing, 15000);
  };

  const stopPinging = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        startPinging();
      } else {
        stopPinging();
      }
      appState.current = nextAppState;
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    startPinging();

    return () => {
      stopPinging();
      sub.remove();
    };
  }, []);
}
