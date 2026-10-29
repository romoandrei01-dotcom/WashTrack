
import { Redirect } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { colors, peso, styles } from "../../constants/theme";
import { useWashTrack } from "../../context/WashTrackContext";

export default function Services() {
  const { role, services, addService, updateService } = useWashTrack();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [message, setMessage] = useState("");

  if (role !== "Owner/Admin") return <Redirect href="/dashboard" />;

  function saveService() {
    const amount = Number(price);
    if (!name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a valid service name and price.");
      return;
    }
    addService(name, amount);
    setName("");
    setPrice("");
    setMessage("Service added successfully.");
  }

  function savePrice(id: string) {
    const amount = Number(editPrice);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a valid price.");
      return;
    }
    updateService(id, amount);
    setEditing(null);
    setMessage("Price updated.");
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Service Management</Text>

      <View style={styles.card}>
        <Text style={styles.label}>New Service Name</Text>
        <TextInput style={styles.input} value={name}
          onChangeText={setName} placeholder="e.g. Express Laundry" />

        <Text style={styles.label}>Price per kg</Text>
        <TextInput style={styles.input} value={price}
          onChangeText={setPrice} keyboardType="decimal-pad"
          placeholder="Enter price" />

        <AppButton title="Add Service" onPress={saveService} />
        {!!message && <Text style={{ color: colors.success }}>{message}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Available Services</Text>

        {services.map(s => (
          <View key={s.id} style={{
            paddingVertical: 15, borderBottomWidth: 1,
            borderColor: colors.border
          }}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>{s.name}</Text>
            <Text style={styles.muted}>{peso(s.price)} per kg</Text>

            {editing === s.id ? (
              <>
                <TextInput style={styles.input} value={editPrice}
                  onChangeText={setEditPrice} keyboardType="decimal-pad" />
                <AppButton title="Save Price"
                  onPress={() => savePrice(s.id)} />
                <AppButton title="Cancel" secondary
                  onPress={() => setEditing(null)} />
              </>
            ) : (
              <AppButton title="Edit Price" secondary onPress={() => {
                setEditing(s.id);
                setEditPrice(String(s.price));
              }} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
