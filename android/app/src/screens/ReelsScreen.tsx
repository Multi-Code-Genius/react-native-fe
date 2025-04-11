import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReelList from '../components/ReelList';
import { ReelsScreenProps } from '../types/video';
import UserProfile from '../components/UserProfile';


const Stack = createStackNavigator();

const ReelsScreen: React.FC<ReelsScreenProps> = ({ isActive }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ReelList">
                {(props) => <ReelList {...props} isActive={isActive} />}
            </Stack.Screen>
            <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
    );
};

export default ReelsScreen;
