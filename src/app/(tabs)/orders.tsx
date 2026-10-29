
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { colors, peso, styles } from "../../constants/theme";
import {
    STATUS_FLOW,
    useWashTrack
} from "../../context/WashTrackContext";

export default function Orders() {
  const { orders, updateStatus } = useWashTrack();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Laundry Orders</Text>
      <AppButton title="+ Create New Order"
        onPress={() => router.push("/create-order")} />

      {orders.length === 0 && (
        <View style={styles.card}><Text>No orders recorded yet.</Text></View>
      )}

      {orders.slice().reverse().map(order => {
        const index = STATUS_FLOW.indexOf(order.status);
        const next = STATUS_FLOW[index + 1];

        return (
          <View key={order.id} style={styles.card}>
            <Text style={css.id}>{order.id}</Text>
            <Text style={css.name}>{order.customerName}</Text>
            <Text style={styles.muted}>Service: {order.serviceName}</Text>
            <Text style={styles.muted}>Weight: {order.weight} kg</Text>
            <Text style={styles.muted}>Total: {peso(order.total)}</Text>
            <Text style={styles.muted}>Payment: {order.paymentStatus}</Text>

            <View style={css.statusBox}>
              <Text style={css.status}>Status: {order.status}</Text>
            </View>

            {order.paymentStatus !== "Paid" && (
              <AppButton title="Record Payment"
                onPress={() => router.push({
                  pathname: "/payment",
                  params: { id: order.id }
                })} />
            )}

            {next && (
              <AppButton title={`Mark as ${next}`} secondary
                onPress={() => {
                  const success = updateStatus(order.id);
                  if (!success && order.status === "Ready for Pickup") {
                    if (typeof window !== "undefined") {
                      window.alert("Full payment is required before release.");
                    }
                  }
                }} />
            )}

            {order.paymentStatus === "Paid" && (
              <AppButton title="View Receipt" secondary
                onPress={() => router.push({
                  pathname: "/receipt",
                  params: { id: order.id }
                })} />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const css = StyleSheet.create({
  id: { color: colors.primary, fontWeight: "bold" },
  name: { fontSize: 19, fontWeight: "bold", marginVertical: 10 },
  statusBox: {
    backgroundColor: "#EFF6FF", padding: 14,
    borderRadius: 9, marginVertical: 15
  },
  status: { color: colors.primary, fontWeight: "bold" }
});
