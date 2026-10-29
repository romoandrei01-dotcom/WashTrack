
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { colors } from "../constants/theme";

export default function Welcome() {
  return (
    <View style={css.container}>
      <View style={css.logo}>
        <Text style={css.logoText}>W</Text>
      </View>

      <Text style={css.title}>WashTrack</Text>
      <Text style={css.subtitle}>Laundry Management System</Text>

      <Text style={css.description}>
        Manage customers, laundry orders, payments,
        and daily laundry operations in one place.
      </Text>

      <View style={{ width: 240 }}>
        <AppButton
          title="Get Started"
          onPress={() => router.push("/login")}
        />
        <AppButton
          title="Track My Laundry"
          secondary
          onPress={() => router.push("/track")}
        />
      </View>

      <Text style={css.footer}>Group 6 • Software Engineering</Text>
    </View>
  );
}

const css = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background,
    alignItems: "center", justifyContent: "center", padding: 24
  },
  logo: {
    width: 90, height: 90, borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
    marginBottom: 24
  },
  logoText: { color: "white", fontSize: 46, fontWeight: "bold" },
  title: { fontSize: 38, fontWeight: "bold", color: colors.dark },
  subtitle: { fontSize: 19, color: colors.primary, marginTop: 8 },
  description: {
    color: colors.muted, textAlign: "center",
    maxWidth: 380, lineHeight: 24, marginVertical: 28
  },
  footer: { position: "absolute", bottom: 25, color: colors.muted }
});
