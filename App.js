import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native'; // Import StatusBar
import AddExpenseScreen from './screens/AddExpenseScreen';
import ExpenseListScreen from './screens/ExpenseListScreen';
import LoadingScreen from './screens/LoadingScreen'; // Import màn hình Loading

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      {/* Hiển thị thanh trạng thái */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoadingScreen"
          screenOptions={{
            headerStyle: { backgroundColor: '#6a1b9a' },
            headerTintColor: '#fff', // Chữ và icon màu trắng
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 }, // Chữ tiêu đề đậm
          }}
        >
          <Stack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddExpenseScreen"
            component={AddExpenseScreen}
            options={{ title: 'Thêm Chi Tiêu Mới' }}
          />
          <Stack.Screen
            name="ExpenseListScreen"
            component={ExpenseListScreen}
            options={{ title: 'Danh Sách Chi Tiêu' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}