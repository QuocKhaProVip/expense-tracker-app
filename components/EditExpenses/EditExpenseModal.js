import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AmountInput from '../AddExpenses/AmountInput';
import NoteInput from '../AddExpenses/NoteInput';
import DatePicker from '../AddExpenses/DatePicker';

export default function EditExpenseModal({ visible, onClose, initialExpense, onSave }) {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Khi `initialExpense` thay đổi, cập nhật state
    useEffect(() => {
        if (initialExpense) {
            setAmount(initialExpense.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // Định dạng số có dấu phẩy
            setNote(initialExpense.note);
            setDate(new Date(initialExpense.date)); // Chuyển đổi date sang object Date
        }
    }, [initialExpense]);

    const handleSave = () => {
        if (!amount || isNaN(amount.replace(/,/g, ''))) {  // Remove commas before checking
            alert('Vui lòng nhập số tiền hợp lệ!');
            return;
        }

        if (!note) {
            alert('Vui lòng không bỏ trống nội dung!');
            return;
        }

        const updatedExpense = {
            ...initialExpense,
            amount: parseFloat(amount.replace(/,/g, '')), // Convert back to number without commas
            note,
            date: date.toISOString(), // Lưu ngày dưới dạng chuỗi ISO
        };

        onSave(updatedExpense);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Sửa Chi Tiêu</Text>

                        {/* Tiêu đề và Trường số tiền */}
                        <Text style={styles.fieldTitle}>
                            {initialExpense && initialExpense.isPaid ? 'Số Tiền Cần Trả' : 'Số Tiền'}
                        </Text>
                        <AmountInput
                            initialValue={amount}
                            onChange={(formattedAmount) => setAmount(formattedAmount)}
                        />

                        {/* Tiêu đề và Trường nội dung */}
                        <Text style={styles.fieldTitle}>Nội Dung</Text>
                        <NoteInput
                            initialValue={note}
                            onChange={(note) => setNote(note)}
                        />

                        {/* Tiêu đề và Chọn ngày */}
                        <View style={styles.datePickerContainer}>
                            <Text style={styles.dateLabel}>Ngày Chi Tiêu:</Text>
                            <DatePicker
                                initialDate={date}
                                onChange={(date) => setDate(date)}
                            />
                        </View>

                        {/* Nút hành động */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
                                <Text style={styles.buttonText}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    fieldTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        padding: 10,
    },
    datePickerContainer: {
        marginBottom: 20,
    },
    dateLabel: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    dateText: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    saveButton: {
        backgroundColor: '#4caf50',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
