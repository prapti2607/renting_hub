import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { ThemeProvider } from "./theme"
import { AuthProvider } from "./context/auth-context"
import { StatusBar } from "react-native"

// Screens
import { LoginScreen } from "./screens/auth/login-screen"
import { RegisterScreen } from "./screens/auth/register-screen"
import { DashboardScreen } from "./screens/dashboard/dashboard-screen"
import { PropertiesScreen } from "./screens/properties/properties-screen"
import { TenantsScreen } from "./screens/tenants/tenants-screen"
import { LeasesScreen } from "./screens/leases/leases-screen"
import { ProfileScreen } from "./screens/profile/profile-screen"

// Icons
import { Home, Building, Users, FileText, User } from "./components/icons"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
        },
        tabBarActiveTintColor: "#0ea5e9",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Properties"
        component={PropertiesScreen}
        options={{
          tabBarIcon: ({ color }) => <Building size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Tenants"
        component={TenantsScreen}
        options={{
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Leases"
        component={LeasesScreen}
        options={{
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />
          </Stack.Navigator>
        </AuthProvider>
      </ThemeProvider>
    </NavigationContainer>
  )
}

