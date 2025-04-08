import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const PaidStatusButton = ({ initialPaidStatus, onChange, statuses }) => {
    useEffect(() => {
        setIsPaid(initialPaidStatus || statuses[0].value); // Set default value
    }, [initialPaidStatus, statuses]);

    const [isPaid, setIsPaid] = useState(initialPaidStatus || statuses[0].value);

    const togglePaidStatus = (status) => {
        setIsPaid(status);
        onChange(status);
    };

    return (
        <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Loại tiền:</Text>
            <View style={styles.buttonGroup}>
                {statuses.map((status, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => togglePaidStatus(status.value)}
                        style={[styles.button, isPaid === status.value && styles.selectedButton]}
                    >
                        <Text style={[styles.buttonText, isPaid === status.value && styles.selectedButtonText]}>{status.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        marginBottom: 10,
    },
    checkboxLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    buttonGroup: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    selectedButton: {
        backgroundColor: '#3e1f47', // Màu khi nút được chọn
    },
    selectedButtonText: {
        color: '#fff'
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14
    },
});

export default PaidStatusButton;
