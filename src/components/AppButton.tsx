
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
};

export function AppButton({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        css.button,
        secondary && css.secondary,
        disabled && { opacity: 0.45 },
      ]}
    >
      <Text style={[css.text, secondary && css.secondaryText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const css = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 6,
  },
  secondary: {
    backgroundColor: "#E8F0FE",
  },
  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryText: {
    color: colors.primary,
  },
});
