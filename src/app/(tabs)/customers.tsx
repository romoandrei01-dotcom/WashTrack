
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { colors, styles } from "../../constants/theme";
import { useWashTrack } from "../../context/WashTrackContext";

export default function Customers() {
  const { customers, addCustomer } = useWashTrack();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  function save() {
    if (!name.trim() || !phone.trim()) {
      setMessage("Please complete all fields.");
      return;
    }

    addCustomer(name, phone);
    setName("");
    setPhone("");
    setMessage("Customer registered successfully.");
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Customer Management</Text>

      <View style={styles.card}>
        <Text style={css.heading}>Register New Customer</Text>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name}
          onChangeText={setName} placeholder="Customer name" />
        <Text style={styles.label}>Contact Number</Text>
        <TextInput style={styles.input} value={phone}
          onChangeText={setPhone} placeholder="09XXXXXXXXX"
          keyboardType="phone-pad" />
        <AppButton title="Save Customer" onPress={save} />
        {!!message && <Text style={css.message}>{message}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={css.heading}>Customer Records ({customers.length})</Text>
        <TextInput style={styles.input} value={search}
          onChangeText={setSearch} placeholder="Search customer..." />

        {filtered.length === 0 && <Text>No customers found.</Text>}
        {filtered.map(c => (
          <View key={c.id} style={css.row}>
            <Text style={{ fontWeight: "bold" }}>{c.name}</Text>
            <Text style={styles.muted}>{c.phone}</Text>
            <Text style={styles.muted}>Customer ID: {c.id}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const css = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.border },
  message: { color: colors.success, marginTop: 10 }
});
