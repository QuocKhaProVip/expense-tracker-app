import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientBackground({ children }) {
    return (
        <LinearGradient
            colors={['#fbc2eb', '#a6c1ee']}

            style={styles.gradientBackground}
        >
            <View style={styles.content}>{children}</View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
