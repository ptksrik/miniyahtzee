import { View, Text } from 'react-native';
import React from 'react';
import styles from '../style/style';

export default function Footer() {
    return (
        <View style={styles.footer}>
            <Text style={styles.author}>
                Author: Riku Pitkänen
            </Text>
        </View>
    );
}
