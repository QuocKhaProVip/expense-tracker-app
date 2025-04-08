import { useState } from 'react';
import { View, Alert, TouchableOpacity, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AmountInput from '../components/AddExpenses/AmountInput';
import NoteInput from '../components/AddExpenses/NoteInput';
import DatePicker from '../components/AddExpenses/DatePicker';
import PaidStatusButton from '../components/AddExpenses/PaidStatusButton';
import GradientBackground from '../layouts/GradientBackground';

export default function AddExpense({ navigation }) {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [isPaid, setIsPaid] = useState(0); // 0 = Không, 1 = Mình nợ, 2 = Nợ mình
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const paidStatuses = [
        { value: 0, label: 'Mình tự chi tiêu' },
        { value: 1, label: 'Mình thiếu tiền người khác' },
        { value: 2, label: 'Người khác thiếu tiền mình' },
    ];

    const addExpense = async () => {
        if (!amount || !note) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setIsLoading(true); // Show loading indicator

        const newExpense = {
            amount: parseFloat(amount.replace(/,/g, '')),
            note,
            date: date.toISOString(),
            isPaid,
            isClickPaid: false,
            id: new Date().toISOString(),
        };

        const storedExpenses = await AsyncStorage.getItem('expenses');
        const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
        expenses.unshift(newExpense);
        await AsyncStorage.setItem('expenses', JSON.stringify(expenses));

        setAmount('');
        setNote('');
        setIsPaid(0);

        // Simulate a delay before showing success message
        setTimeout(() => {
            setIsLoading(false); // Hide loading indicator
            Alert.alert('Thành công', 'Chi tiêu đã được thêm thành công. Vui lòng bấm vào nút "Xem Chi Tiết" để kiểm tra!');
        }, 1000); // Delay of 1 seconds (adjust as needed)
    };

    return (
        <GradientBackground>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <AmountInput initialValue={amount} onChange={setAmount} />
                    <NoteInput initialValue={note} onChange={setNote} />
                    <DatePicker initialDate={date} onChange={setDate} />
                    <PaidStatusButton initialPaidStatus={isPaid} onChange={setIsPaid} statuses={paidStatuses} />

                    {/* Show loading overlay if isLoading is true */}
                    {isLoading && (
                        <View style={styles.overlay}>
                            <ActivityIndicator size="large" color="#007bff" />
                        </View>
                    )}

                    {/* Main buttons */}
                    {!isLoading && (
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.addButton} onPress={addExpense}>
                                <Text style={styles.addButtonText}>Xác Nhận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewExpensesButton} onPress={() => navigation.navigate('ExpenseListScreen')}>
                                <Text style={styles.viewExpensesButtonText}>Xem Chi Tiết</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f5f5f5',
        padding: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    addButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    viewExpensesButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    viewExpensesButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background dimming
        justifyContent: 'center',
        alignItems: 'center',
    },
});
