
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { colors } from "../constants/theme";
import { useWashTrack } from "../context/WashTrackContext";

export default function Login() {
  const { login } = useWashTrack();

  function enter(role: "Staff" | "Owner/Admin") {
    login(role);
    router.replace("/dashboard");
  }

  return (
    <View style={css.container}>
      <View style={css.card}>
        <Text style={css.title}>WashTrack Login</Text>
        <Text style={css.subtitle}>Choose a demonstration role</Text>

        <AppButton title="Continue as Staff" onPress={() => enter("Staff")} />
        <AppButton
          title="Continue as Owner/Admin"
          secondary
          onPress={() => enter("Owner/Admin")}
        />
        <AppButton
          title="Back to Welcome"
          secondary
          onPress={() => router.replace("/")}
        />

        <Text style={css.note}>
          Prototype access only. Secure login will be added
          during backend development.
        </Text>
      </View>
    </View>
  );
}

const css = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: "center", alignItems: "center", padding: 20
  },
  card: {
    backgroundColor: "white", padding: 30,
    borderRadius: 16, width: "100%", maxWidth: 430
  },
  title: { fontSize: 27, fontWeight: "bold", color: colors.dark },
  subtitle: { color: colors.muted, marginVertical: 20 },
  note: { color: colors.muted, fontSize: 12, marginTop: 20, lineHeight: 19 }
});
