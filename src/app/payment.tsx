
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { colors, peso, styles } from "../constants/theme";
import { useWashTrack } from "../context/WashTrackContext";

export default function Payment() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, recordPayment, role, loaded } = useWashTrack();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [error, setError] = useState("");

  if (!loaded) return null;
  if (!role) return <Redirect href="/login" />;

  const order = orders.find(o => o.id === id);
  if (!order) return <Text style={{ padding: 25 }}>Order not found.</Text>;

  const remaining = Math.max(0, order.total - order.paymentAmount);

  function save() {
    const success = recordPayment(order!.id, Number(amount), method);
    if (!success) {
      setError("Enter a valid amount not exceeding the balance.");
      return;
    }
    router.replace("/orders");
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: true, title: "Record Payment" }} />
      <Text style={styles.title}>Payment Processing</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Order ID: {order.id}</Text>
        <Text style={styles.label}>Customer: {order.customerName}</Text>
        <Text style={styles.label}>Total: {peso(order.total)}</Text>
        <Text style={styles.label}>Already Paid: {peso(order.paymentAmount)}</Text>
        <Text style={styles.label}>Balance: {peso(remaining)}</Text>

        <Text style={styles.label}>Amount to Pay</Text>
        <TextInput style={styles.input} value={amount}
          onChangeText={setAmount} keyboardType="decimal-pad"
          placeholder="Enter payment amount" />

        <Text style={styles.label}>Payment Method</Text>
        {["Cash", "GCash", "Bank Transfer"].map(item => (
          <Pressable key={item} onPress={() => setMethod(item)}
            style={{
              padding: 14, marginVertical: 5, borderRadius: 9,
              borderWidth: 1,
              borderColor: method === item ? colors.primary : colors.border,
              backgroundColor: method === item ? "#EFF6FF" : "white"
            }}>
            <Text>{method === item ? "◉" : "○"} {item}</Text>
          </Pressable>
        ))}

        {!!error && <Text style={{ color: colors.danger }}>{error}</Text>}
        <AppButton title="Save Payment" onPress={save} />
      </View>
    </ScrollView>
  );
}
