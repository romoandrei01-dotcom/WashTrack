
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { colors, peso, styles } from "../constants/theme";
import { useWashTrack } from "../context/WashTrackContext";

export default function Receipt() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, role, loaded } = useWashTrack();

  if (!loaded) return null;
  if (!role) return <Redirect href="/login" />;

  const order = orders.find(o => o.id === id);
  if (!order || order.paymentStatus !== "Paid") {
    return <Text style={{ padding: 25 }}>Paid receipt not available.</Text>;
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: true, title: "Payment Receipt" }} />

      <View style={styles.card}>
        <Text style={css.heading}>WashTrack</Text>
        <Text style={css.center}>Laundry Management System</Text>
        <Text style={css.center}>PAYMENT RECEIPT</Text>

        <View style={css.line} />
        <Text>Order Number: {order.id}</Text>
        <Text>Customer: {order.customerName}</Text>
        <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
        <Text>Service: {order.serviceName}</Text>
        <Text>Weight: {order.weight} kg</Text>

        <View style={css.line} />
        <Text style={css.total}>Total: {peso(order.total)}</Text>
        <Text>Amount Paid: {peso(order.paymentAmount)}</Text>
        <Text>Payment Method: {order.paymentMethod}</Text>
        <Text>Payment Status: {order.paymentStatus}</Text>

        <View style={css.line} />
        <Text style={css.center}>Thank you for choosing WashTrack!</Text>
      </View>

      <AppButton title="Back to Orders"
        onPress={() => router.replace("/orders")} />
    </ScrollView>
  );
}

const css = StyleSheet.create({
  heading: { fontSize: 28, fontWeight: "bold", color: colors.primary, textAlign: "center" },
  center: { textAlign: "center", marginVertical: 6 },
  line: { height: 1, backgroundColor: colors.border, marginVertical: 20 },
  total: { fontSize: 23, fontWeight: "bold", marginBottom: 10 }
});
