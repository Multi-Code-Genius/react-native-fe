// components/StickyHeader.tsx or .jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

const StickyHeader = () => {
    type NavigationProp = StackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const theme = useTheme();
    const handleLike = () => {
        navigation.navigate('FriendsRequestAcceptScreen');
    };
    const handleUser = () => {
        navigation.navigate('Profile');
    };
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{route.name}</Text>
            <View style={styles.iconGroup}>
                <IconButton
                    icon="heart"
                    iconColor={'white'}
                    onPress={handleLike}
                />
                <View>
                    <IconButton
                        icon="account-outline"
                        iconColor="white"
                        onPress={handleUser}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: '#0f0f0f',
        paddingHorizontal: 12,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
});

export default StickyHeader;
