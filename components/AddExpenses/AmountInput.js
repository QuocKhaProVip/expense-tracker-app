import { useState, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const AmountInput = ({ initialValue, onChange }) => {
    const [amount, setAmount] = useState(initialValue || '');
    const [isFocused, setIsFocused] = useState(false); // Track if input is focused

    // Cập nhật lại amount khi initialValue thay đổi
    useEffect(() => {
        setAmount(initialValue || ''); // Reset lại giá trị khi initialValue thay đổi
    }, [initialValue]); // Khi initialValue thay đổi, useEffect sẽ được gọi lại

    const handleAmountChange = (text) => {
        const formattedAmount = text.replace(/[^\d]/g, ''); // remove non-numeric characters
        const formattedAmountWithCommas = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas
        setAmount(formattedAmountWithCommas);
        onChange(formattedAmountWithCommas);
    };

    return (
        <TextInput
            style={[styles.input, isFocused && styles.focusedInput]} // Apply focused styles
            placeholder="Nhập số tiền (VND)"
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
            onFocus={() => setIsFocused(true)} // When the input is focused
            onBlur={() => setIsFocused(false)}  // When the input loses focus
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
        fontSize: 14,
    },
    focusedInput: {
        borderColor: '#6a1b9a', // Change the border color when focused
        borderWidth: 2, // Increase border width to indicate focus
    },
});

export default AmountInput;
