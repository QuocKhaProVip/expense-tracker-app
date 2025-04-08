import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import GradientBackground from '../layouts/GradientBackground';

export default function LoadingScreen({ navigation }) {
    useEffect(() => {
        // Chuyển đến màn hình AddExpenseScreen sau 3 giây
        setTimeout(() => {
            navigation.replace('AddExpenseScreen');
        }, 3000); // 3 giây
    }, [navigation]);

    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Hiển thị icon */}
                <Image
                    source={require('../assets/icon.png')} // Thay thế bằng đường dẫn icon của bạn
                    style={styles.icon}
                />
                {/* Hiển thị loading spinner */}
                <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
                {/* Hiển thị chữ */}
                <Text style={styles.title}>Ứng Dụng Quản Lý Chi Tiêu{'\n'}</Text>
                <Text style={styles.author}>Tạo Bởi Đức Lê</Text>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f5f5f5', // Màu nền
    },
    icon: {
        width: 150, // Kích thước icon
        height: 150,
        marginBottom: 20, // Khoảng cách dưới icon
    },
    spinner: {
        marginBottom: 20, // Khoảng cách dưới spinner
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // Màu chữ
    },
    author: {
        fontSize: 16,
        color: '#333', // Màu chữ
    },
});
