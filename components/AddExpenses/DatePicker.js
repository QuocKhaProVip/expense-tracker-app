import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ initialDate, onChange }) => {
    const [date, setDate] = useState(initialDate || new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Cập nhật lại date khi initialDate thay đổi
    useEffect(() => {
        setDate(initialDate || new Date()); // Reset lại giá trị khi initialDate thay đổi
    }, [initialDate]);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
        onChange(currentDate);
    };

    return (
        <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Chọn ngày ghi chú:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>{date.toLocaleDateString('vi-VN')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    datePickerContainer: {
        marginBottom: 10,
    },
    dateLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    dateButton: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
        // borderColor: '#ddd',
        // borderWidth: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#fff',
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007bff',
    },
});

export default DatePicker;
