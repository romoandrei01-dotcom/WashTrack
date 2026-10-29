
import { router, Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { peso, styles } from "../constants/theme";
import { useWashTrack } from "../context/WashTrackContext";

export default function Track() {
  const { customers, orders } = useWashTrack();
  const [customerId, setCustomerId] = useState("");
  const [searched, setSearched] = useState("");

  const customer = customers.find(
    c => c.id.toLowerCase() === searched.trim().toLowerCase()
  );
  const history = customer
    ? orders.filter(o => o.customerId === customer.id)
    : [];

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: true, title: "Track Laundry" }} />
      <Text style={styles.title}>Track My Laundry</Text>

      <View style={styles.card}>
        <Text style={styles.muted}>
          Enter the customer ID provided by the laundry shop.
        </Text>
        <TextInput style={styles.input} value={customerId}
          onChangeText={setCustomerId} placeholder="Customer ID" />
        <AppButton title="Search My Orders"
          onPress={() => setSearched(customerId)} />
      </View>

      {!!searched && !customer && (
        <View style={styles.card}><Text>Customer not found.</Text></View>
      )}

      {customer && (
        <View style={styles.card}>
          <Text style={styles.title}>{customer.name}</Text>
          <Text style={styles.muted}>Order History</Text>
          {history.length === 0 && <Text>No orders found.</Text>}
          {history.slice().reverse().map(o => (
            <View key={o.id} style={{
              paddingVertical: 15, borderBottomWidth: 1,
              borderColor: "#E2E8F0"
            }}>
              <Text style={{ fontWeight: "bold" }}>{o.id}</Text>
              <Text>{o.serviceName} — {peso(o.total)}</Text>
              <Text>Status: {o.status}</Text>
              <Text>Payment: {o.paymentStatus}</Text>
            </View>
          ))}
        </View>
      )}

      <AppButton title="Back to Welcome" secondary
        onPress={() => router.replace("/")} />
    </ScrollView>
  );
}
