import React from 'react';
import { View, StyleSheet } from 'react-native';
import StickyHeader from './StickyHeader';

const ScreenWithHeader = ({ children }: any) => (
    <View style={styles.container}>
        <StickyHeader />
        <View style={styles.content}>{children}</View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
});

export default ScreenWithHeader;
