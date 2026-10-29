
import { Redirect, router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { colors, peso, styles } from "../constants/theme";
import { useWashTrack } from "../context/WashTrackContext";

export default function CreateOrder() {
  const { customers, services, addOrder, role, loaded } = useWashTrack();
  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  if (!loaded) return null;
  if (!role) return <Redirect href="/login" />;

  const selected = services.find(s => s.id === serviceId);
  const kg = Number(weight);
  const total = selected && kg > 0 ? selected.price * kg : 0;

  function save() {
    const id = addOrder(customerId, serviceId, kg);
    if (!id) {
      setError("Select a customer, service, and valid weight.");
      return;
    }
    router.replace("/orders");
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: true, title: "Create Laundry Order" }} />
      <Text style={styles.title}>Create Laundry Order</Text>

      <View style={styles.card}>
        <Text style={css.heading}>1. Select Customer</Text>
        {customers.length === 0 && (
          <Text style={styles.muted}>Register a customer first.</Text>
        )}
        {customers.map(c => (
          <Pressable key={c.id} onPress={() => setCustomerId(c.id)}
            style={[css.option, customerId === c.id && css.selected]}>
            <Text style={css.bold}>{c.name}</Text>
            <Text style={styles.muted}>{c.phone}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={css.heading}>2. Select Laundry Service</Text>
        {services.map(s => (
          <Pressable key={s.id} onPress={() => setServiceId(s.id)}
            style={[css.option, serviceId === s.id && css.selected]}>
            <Text style={css.bold}>{s.name}</Text>
            <Text style={styles.muted}>{peso(s.price)}/kg</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={css.heading}>3. Enter Laundry Weight</Text>
        <TextInput style={styles.input} value={weight}
          onChangeText={setWeight} keyboardType="decimal-pad"
          placeholder="Weight in kilograms" />

        <View style={css.total}>
          <Text style={css.bold}>Total Amount</Text>
          <Text style={css.price}>{peso(total)}</Text>
        </View>

        {!!error && <Text style={{ color: colors.danger }}>{error}</Text>}
        <AppButton title="Create Order" onPress={save} />
        <AppButton title="Cancel" secondary
          onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const css = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  bold: { fontWeight: "bold", color: colors.text },
  option: {
    borderWidth: 1, borderColor: colors.border,
    padding: 15, borderRadius: 10, marginBottom: 10
  },
  selected: { backgroundColor: "#EFF6FF", borderColor: colors.primary, borderWidth: 2 },
  total: { backgroundColor: "#EFF6FF", padding: 20, borderRadius: 10, marginVertical: 18 },
  price: { fontSize: 30, fontWeight: "bold", color: colors.primary }
});
