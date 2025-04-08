import { useState, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const NoteInput = ({ initialValue, onChange }) => {
    const [note, setNote] = useState(initialValue || '');
    const [isFocused, setIsFocused] = useState(false); // Track if input is focused

    // Cập nhật lại note khi initialValue thay đổi
    useEffect(() => {
        setNote(initialValue || ''); // Reset lại giá trị khi initialValue thay đổi
    }, [initialValue]); // Khi initialValue thay đổi, useEffect sẽ được gọi lại

    const handleNoteChange = (text) => {
        setNote(text);
        onChange(text);
    };

    return (
        <TextInput
            style={[styles.input, isFocused && styles.focusedInput]} // Apply focused styles
            placeholder="Ghi chú"
            value={note}
            onChangeText={handleNoteChange}
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

export default NoteInput;
