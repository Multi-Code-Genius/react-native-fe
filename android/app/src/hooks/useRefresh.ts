import {useCallback, useState} from 'react';
import {Alert} from 'react-native';

export const useRefresh = (refetch: any) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {onRefresh, refreshing};
};
