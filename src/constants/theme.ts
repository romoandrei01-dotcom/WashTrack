
export const colors = {
  primary: "#2563EB",
  dark: "#163B67",
  background: "#F3F7FC",
  surface: "#FFFFFF",
  text: "#172B4D",
  muted: "#64748B",
  border: "#E2E8F0",
  success: "#15803D",
  warning: "#D97706",
  danger: "#DC2626",
};

export const styles = {
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: "100%" as const,
    maxWidth: 1000,
    alignSelf: "center" as const,
    padding: 20,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    padding: 13,
    marginVertical: 7,
    fontSize: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginTop: 10,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
  },
};

export function peso(value: number) {
  return "₱" + Number(value).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
