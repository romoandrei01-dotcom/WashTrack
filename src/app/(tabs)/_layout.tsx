
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { colors } from "../../constants/theme";
import { useWashTrack } from "../../context/WashTrackContext";

export default function TabLayout() {
  const { role, loaded } = useWashTrack();

  if (!loaded) {
    return null;
  }

  if (!role) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.dark,
        },

        headerTintColor: "#FFFFFF",

        headerTitleStyle: {
          fontWeight: "bold",
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#64748B",

        tabBarShowLabel: true,

        tabBarStyle: {
          height: 70,
          paddingTop: 6,
          paddingBottom: 6,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
        },

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 0,
        },

        tabBarIconStyle: {
          marginBottom: 0,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="grid-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="customers"
        options={{
          title: "Customers",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="people-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="basket-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          href: role === "Owner/Admin" ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="pricetags-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
