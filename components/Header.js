import { View, Text } from 'react-native';
import React from 'react';
import styles from '../style/style';

export default function Header() {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>
                Mini yahtzee
            </Text>
        </View>
    );
}
