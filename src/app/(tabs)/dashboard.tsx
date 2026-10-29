
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { colors, peso, styles } from "../../constants/theme";
import { useWashTrack } from "../../context/WashTrackContext";

export default function Dashboard() {
  const { orders, customers, role, logout } = useWashTrack();

  const stats = [
    ["Total Orders", orders.length],
    ["Pending", orders.filter(o => o.status === "Pending").length],
    ["Ongoing", orders.filter(o => o.status === "Ongoing").length],
    ["Ready for Pickup", orders.filter(o => o.status === "Ready for Pickup").length],
    ["Completed", orders.filter(o => o.status === "Completed").length],
    ["Customers", customers.length],
  ];

  const collected = orders.reduce((sum, o) => sum + o.paymentAmount, 0);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome to WashTrack</Text>
      <Text style={styles.muted}>Signed in as {role}</Text>

      <View style={css.grid}>
        {stats.map(([label, value]) => (
          <View key={label} style={css.stat}>
            <Text style={styles.muted}>{label}</Text>
            <Text style={css.number}>{value}</Text>
          </View>
        ))}
      </View>

      {role === "Owner/Admin" && (
        <View style={styles.card}>
          <Text style={css.heading}>Transaction Summary</Text>
          <Text style={styles.muted}>Total Recorded Payments</Text>
          <Text style={css.number}>{peso(collected)}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={css.heading}>Quick Actions</Text>
        <AppButton title="+ Create Laundry Order"
          onPress={() => router.push("/create-order")} />
        <AppButton title="Manage Customers" secondary
          onPress={() => router.navigate("/customers")} />
        <AppButton title="View Laundry Orders" secondary
          onPress={() => router.navigate("/orders")} />
      </View>

      <View style={styles.card}>
        <Text style={css.heading}>Recent Orders</Text>
        {orders.length === 0 && <Text>No orders recorded yet.</Text>}
        {orders.slice(-5).reverse().map(o => (
          <View key={o.id} style={css.order}>
            <Text style={{ fontWeight: "bold" }}>{o.customerName}</Text>
            <Text>{o.status} • {peso(o.total)}</Text>
          </View>
        ))}
      </View>

      <AppButton title="Logout" secondary onPress={() => {
        logout();
        router.replace("/");
      }} />
    </ScrollView>
  );
}

const css = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginVertical: 20 },
  stat: {
    backgroundColor: "white", padding: 20,
    borderRadius: 12, minWidth: 145, flexGrow: 1, flexBasis: "28%"
  },
  number: { fontSize: 28, fontWeight: "bold", color: colors.primary, marginTop: 10 },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  order: { paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.border }
});
