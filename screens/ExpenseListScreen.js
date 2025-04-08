import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditExpenseModal from '../components/EditExpenses/EditExpenseModal';
import ExpenseItem from '../components/ExpenseList/ExpenseItem';
import GradientBackground from '../layouts/GradientBackground'

export default function ExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [filterType, setFilterType] = useState('expense'); // Mặc định là Chi Tiêu
    const [modalData, setModalData] = useState(null);
    const [loading, setLoading] = useState(false); // Có thể không cần nữa nhưng giữ lại để kiểm tra
    const [isLoading, setIsLoading] = useState(false);  // Trạng thái mới cho vòng quay


    useEffect(() => {
        const fetchExpenses = async () => {
            if (loading) return;
            setLoading(true);

            try {
                const storedExpenses = await AsyncStorage.getItem('expenses');
                if (storedExpenses) {
                    const parsedExpenses = JSON.parse(storedExpenses);
                    setExpenses(parsedExpenses); // Lấy tất cả chi tiêu
                }
            }
            catch (error) {
                console.error('Lỗi khi lấy chi tiêu:', error);
            }
            setLoading(false);
        };

        fetchExpenses();
    }, []); // Chạy một lần khi component được load

    const handleEditExpense = (expense) => {
        setModalData(expense);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    const deleteExpense = useCallback((id) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa chi tiêu này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: () => {
                        setIsLoading(true);  // Bắt đầu vòng quay
                        setTimeout(() => {  // Sau 1 giây thì thực hiện hành động xóa
                            const updatedExpenses = expenses.filter((expense) => expense.id !== id);
                            setExpenses(updatedExpenses);
                            AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
                            setIsLoading(false);  // Dừng vòng quay

                            Alert.alert(
                                "Thông báo",
                                "Chi tiêu này đã được xóa!",
                                [{ text: "OK", style: "default" }]
                            );
                        }, 1000);  // Delay 1 giây
                    },
                    style: "destructive",
                },
            ]
        );
    }, [expenses]);

    const handleDeleteAll = useCallback(() => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa tất cả chi tiêu không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa Tất Cả",
                    onPress: async () => {
                        setIsLoading(true);  // Bắt đầu vòng quay
                        setTimeout(async () => {
                            try {
                                setExpenses([]);
                                await AsyncStorage.removeItem('expenses');
                                setIsLoading(false);  // Dừng vòng quay

                                Alert.alert(
                                    "Thông báo",
                                    "Tất cả chi tiêu đã được xóa!",
                                    [{ text: "OK", style: "default" }]
                                );
                            } catch (error) {
                                console.error("Lỗi khi xóa tất cả chi tiêu:", error);
                                setIsLoading(false);  // Dừng vòng quay nếu có lỗi
                            }
                        }, 1000);  // Delay 1 giây
                    },
                    style: "destructive",
                },
            ]
        );
    }, []);

    const handleSaveExpense = useCallback((updatedExpense) => {
        const expenseIndex = expenses.findIndex(expense => expense.id === updatedExpense.id);

        if (expenseIndex !== -1) {
            setIsLoading(true);  // Bắt đầu vòng quay

            setTimeout(() => {
                const updatedExpenses = [...expenses];
                updatedExpenses[expenseIndex] = updatedExpense;

                setExpenses(updatedExpenses);  // Cập nhật trạng thái
                AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));  // Lưu vào AsyncStorage

                setIsLoading(false);  // Dừng vòng quay

                Alert.alert(
                    "Thông báo",
                    "Chi tiêu này đã được sửa thành công!",
                    [{ text: "OK", style: "default" }]
                );
            }, 1000);  // Delay 1 giây
        }
    }, [expenses]);

    const togglePaidStatus = useCallback((id, status, alertText, confirmText, successText) => {
        Alert.alert(
            "Xác nhận",
            alertText,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: confirmText,
                    onPress: () => {
                        setIsLoading(true);  // Bắt đầu vòng quay
                        setTimeout(() => {
                            const updatedExpenses = expenses.map((expense) =>
                                expense.id === id ? { ...expense, isPaid: status, isClickPaid: true } : expense
                            );
                            setExpenses(updatedExpenses);
                            AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
                            setIsLoading(false);  // Dừng vòng quay

                            Alert.alert(
                                "Thông báo",
                                `${successText}!`,
                                [{ text: "OK", style: "default" }]
                            );
                        }, 1000);  // Delay 1 giây
                    },
                    style: "default",
                },
            ]
        );
    }, [expenses]);

    const togglePaidStatus1 = (id) => {
        togglePaidStatus(id, 1, "Bạn có chắc chắn đã trả khoản tiền này chưa?", "Đã Trả", 'Thành công xác nhận đã trả khoản tiền này');
    };

    const togglePaidStatus2 = (id) => {
        togglePaidStatus(id, 2, "Bạn có chắc chắn đã nhận được khoản tiền này chưa?", "Đã nhận", 'Thành công xác nhận đã nhận khoản tiền này');
    };

    const sortedExpenses = useMemo(() => {
        return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [expenses]);

    const filterMap = useMemo(() => ({
        expense: expense => expense.isPaid === 0, // Chi tiêu
        paid: expense => expense.isPaid === 1,   // Trả
        received: expense => expense.isPaid === 2, // Nhận
    }), []);

    const filteredExpenses = useMemo(() => {
        return sortedExpenses.filter(filterMap[filterType] || filterMap.all);
    }, [sortedExpenses, filterMap, filterType]);

    const { totalExpense, totalUnpaid, totalUnreceived, totalPaid, totalReceived } = useMemo(() => {
        let totalExpense = 0;
        let totalUnpaid = 0;
        let totalUnreceived = 0;
        let totalPaid = 0;
        let totalReceived = 0;

        filteredExpenses.forEach(expense => {
            if (expense.isPaid === 0) totalExpense += expense.amount;
            if (expense.isPaid === 1 && !expense.isClickPaid) totalUnpaid += expense.amount;
            if (expense.isPaid === 2 && !expense.isClickPaid) totalUnreceived += expense.amount;
            if (expense.isPaid === 1 && expense.isClickPaid) totalPaid += expense.amount;
            if (expense.isPaid === 2 && expense.isClickPaid) totalReceived += expense.amount;
        });

        return { totalExpense, totalUnpaid, totalUnreceived, totalPaid, totalReceived };
    }, [filteredExpenses]);

    const handleFilterChange = useCallback((type) => {
        setFilterType(type);
    }, []);

    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Show loading spinner */}
                {isLoading && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                )}
                {/* Display total amounts with filter type */}
                <View style={styles.totalContainer}>
                    {filterType === 'received' && (
                        <View>
                            <Text style={styles.totalText}>
                                Tổng số tiền đã nhận:{'\n'}
                                <Text style={styles.totalTextNumber0}>{totalReceived.toLocaleString('vi-VN')} VND</Text>
                            </Text>
                            <Text style={styles.totalText}>
                                Tổng số tiền chưa nhận:{'\n'}
                                <Text style={styles.totalTextNumber2}>{totalUnreceived.toLocaleString('vi-VN')} VND</Text>
                            </Text>
                        </View>

                    )}

                    {filterType === 'paid' && (
                        <View>
                            <Text style={styles.totalText}>
                                Tổng số tiền đã trả:{'\n'}
                                <Text style={styles.totalTextNumber0}>{totalPaid.toLocaleString('vi-VN')} VND</Text>
                            </Text>
                            <Text style={styles.totalText}>
                                Tổng số tiền chưa trả:{'\n'}
                                <Text style={styles.totalTextNumber1}>{totalUnpaid.toLocaleString('vi-VN')} VND</Text>
                            </Text>
                        </View>
                    )}

                    {filterType === 'expense' && (
                        <>
                            <Text style={styles.totalText}>
                                Tổng số tiền chi tiêu:{'\n'}
                                <Text style={styles.totalTextNumber0}>{totalExpense.toLocaleString('vi-VN')} VND</Text>
                            </Text>
                        </>
                    )}
                </View>

                {expenses.length !== 0 && (
                    <View style={styles.deleteAllContainer}>
                        <TouchableOpacity
                            onPress={handleDeleteAll}
                            style={styles.deleteAllButton}
                        >
                            <Text style={styles.deleteAllButtonText}>Xóa Tất Cả</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Filter section */}
                <View style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>Lọc theo:</Text>
                    <View style={styles.filterButtons}>
                        <TouchableOpacity
                            onPress={() => handleFilterChange('expense')}
                            style={[styles.filterButton, filterType === 'expense' && styles.selectedFilter]}
                        >
                            <Text style={[styles.filterButtonText, filterType === 'expense' && styles.selectedFilterText]}>Chi Tiêu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleFilterChange('paid')}
                            style={[styles.filterButton, filterType === 'paid' && styles.selectedFilter]}
                        >
                            <Text style={[styles.filterButtonText, filterType === 'paid' && styles.selectedFilterText]}>Trả</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleFilterChange('received')}
                            style={[styles.filterButton, filterType === 'received' && styles.selectedFilter]}
                        >
                            <Text style={[styles.filterButtonText, filterType === 'received' && styles.selectedFilterText]}>Nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Display a message if no filteredExpenses are available */}
                {filteredExpenses.length === 0 ? (
                    <View style={styles.noExpensesContainer}>
                        <Text style={styles.noExpensesText}>Hiện tại chưa có khoản ghi nhận nào.</Text>
                    </View>
                ) : (
                    // Display filteredExpenses
                    <FlatList
                        data={filteredExpenses}
                        renderItem={({ item }) => (
                            <ExpenseItem
                                item={item}
                                onEdit={handleEditExpense}
                                onDelete={deleteExpense}
                                onTogglePaid1={togglePaidStatus1}
                                onTogglePaid2={togglePaidStatus2}
                            />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        extraData={filteredExpenses}
                    />
                )}

                <EditExpenseModal
                    visible={modalData !== null}
                    onClose={handleCloseModal}
                    initialExpense={modalData}
                    onSave={handleSaveExpense}
                />
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,

    },
    totalContainer: {
        // borderWidth: 2,
        marginBottom: 20,
        padding: 10,
        // backgroundColor: '#e0e0e0',
        borderRadius: 5,
        minHeight: 80,
        justifyContent: 'center',
        alignContent: 'center',
        minHeight: 120,
    },
    // receivedContainer: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // paidContainer: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // totalTextOnly: {
    //     fontSize: 14,
    //     textAlign: 'center',
    // },
    totalText: {
        fontSize: 14,
        textAlign: 'center'
    },
    totalTextNumber0: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalTextNumber1: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
    },
    totalTextNumber2: {
        fontSize: 16,
        color: '#1a1a7e',
        fontWeight: 'bold',
    },
    filterContainer: {
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        // backgroundColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    selectedFilter: {
        backgroundColor: '#007bff',
    },
    selectedFilterText: {
        color: '#fff'
    },
    filterButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },

    noExpensesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    noExpensesText: {
        fontSize: 14,
        color: '#808080',
        fontStyle: 'italic',
    },
    deleteAllContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },

    deleteAllButton: {
        backgroundColor: '#6b0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },

    deleteAllButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Làm mờ nền
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,  // Đảm bảo vòng quay xuất hiện trên các thành phần khác
    },
});
