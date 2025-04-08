import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ExpenseItem({ item, onEdit, onDelete, onTogglePaid1, onTogglePaid2 }) {
    const formattedDate = new Date(item.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const formattedDateNew = new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <View
            style={[
                styles.expenseItem,
                item.isPaid === 1 && styles.paidBorderColor,
                item.isPaid === 2 && styles.receiveBorderColor,
                item.isClickPaid && styles.paidBackgroundText,
            ]}
        >
            <View style={styles.expenseTextDetails}>
                <Text style={styles.expenseTextDetail}>
                    <Text style={styles.expenseTextDetailsLabels}>
                        {item.isPaid === 1 && !item.isClickPaid ? 'Số Tiền Cần Trả:' :
                            item.isPaid === 2 && !item.isClickPaid ? 'Số Tiền Chưa Nhận:' :
                                item.isPaid === 1 && item.isClickPaid ? 'Số Tiền Đã Trả:' :
                                    item.isPaid === 2 && item.isClickPaid ? 'Số Tiền Đã Nhận:' :
                                        'Số Tiền Chi Tiêu:'}
                    </Text>
                    {'\n'}{item.amount.toLocaleString('vi-VN')} VND
                </Text>
                <Text style={styles.expenseTextDetail}>
                    <Text style={styles.expenseTextDetailsLabels}>Nội Dung:</Text>
                    {'\n'}{item.note}
                </Text>
                <Text style={styles.expenseTextDetail}>

                    <Text style={styles.expenseTextDetailsLabels}>
                        {item.isPaid === 1 && item.isClickPaid ? 'Ngày Trả:' :
                            item.isPaid === 2 && item.isClickPaid ? 'Ngày Nhận:' :
                                'Ngày Ghi Chú:'}
                    </Text>
                    {'\n'}{(item.isPaid === 1 || item.isPaid === 2) && item.isClickPaid ? formattedDateNew :
                            formattedDate}
                    

                </Text>
            </View>

            <View style={styles.actionButtonsContainer}>
                {item.isPaid === 1 && !item.isClickPaid && (
                    <TouchableOpacity
                        onPress={() => onTogglePaid1(item.id)}
                        style={[styles.actionButton, styles.paidButton]}
                    >
                        <Text style={styles.paidButtonText}>Đã Trả</Text>
                    </TouchableOpacity>
                )}

                {item.isPaid === 2 && !item.isClickPaid && (
                    <TouchableOpacity
                        onPress={() => onTogglePaid2(item.id)}
                        style={[styles.actionButton, styles.receiveButton]}
                    >
                        <Text style={styles.receiveButtonText}>Đã Nhận</Text>
                    </TouchableOpacity>
                )}
                {!item.isClickPaid && (
                    <TouchableOpacity
                        onPress={() => onEdit(item)}
                        style={[styles.actionButton, styles.editButton]}
                    >
                        <Text style={styles.editButtonText}>Sửa</Text>
                    </TouchableOpacity>
                )}


                <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    style={[styles.actionButton, styles.deleteButton]}
                >
                    <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    expenseItem: {
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        flexDirection: 'row', // Đảm bảo rằng nội dung được căn theo chiều ngang
        justifyContent: 'space-between', // Đảm bảo có khoảng cách giữa văn bản và nút
        alignItems: 'center', // Căn giữa theo chiều dọc
        minHeight: 100,
    },
    paidBorderColor: {
        borderColor: 'green'
    },
    receiveBorderColor: {
        borderColor: '#1a1a7e'
    },
    expenseTextDetails: {
        flex: 2,
        flexDirection: 'column',
    },
    expenseTextDetail: {
        fontSize: 14,
        marginBottom: 5,
    },
    expenseTextDetailsLabels: {
        fontWeight: 'bold',
    },
    paidBackgroundText: {
        backgroundColor: '#c0c0c0',
        borderColor: '#000'
    },
    actionButtonsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end', // Căn nút sang bên phải
    },
    actionButton: {
        marginLeft: 10, // Tạo khoảng cách giữa các nút
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paidButton: {
        backgroundColor: '#4caf50',
        marginBottom: 10,
    },
    paidButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    receiveButton: {
        backgroundColor: '#1a1a7e',
        marginBottom: 10,
    },
    receiveButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#3e1f47',
        marginBottom: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
})