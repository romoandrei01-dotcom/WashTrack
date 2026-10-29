
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AppButton } from "../../components/AppButton";
import { colors, peso, styles } from "../../constants/theme";
import {
  STATUS_FLOW,
  useWashTrack,
} from "../../context/WashTrackContext";

const FILTERS = [
  "All",
  "Pending",
  "Ongoing",
  "Ready for Pickup",
  "Completed",
] as const;

type StatusFilter = (typeof FILTERS)[number];

export default function Orders() {
  const { orders, updateStatus } = useWashTrack();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<StatusFilter>("All");

  // Count orders by status.
  const statusCounts = useMemo(() => {
    return {
      All: orders.length,
      Pending: orders.filter(
        (order) => order.status === "Pending"
      ).length,
      Ongoing: orders.filter(
        (order) => order.status === "Ongoing"
      ).length,
      "Ready for Pickup": orders.filter(
        (order) => order.status === "Ready for Pickup"
      ).length,
      Completed: orders.filter(
        (order) => order.status === "Completed"
      ).length,
    };
  }, [orders]);

  // Search and filter the existing orders.
  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        const matchesStatus =
          activeFilter === "All" ||
          order.status === activeFilter;

        const searchableText = [
          String(order.id),
          String(order.customerName),
          String(order.serviceName),
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          keyword === "" ||
          searchableText.includes(keyword);

        return matchesStatus && matchesSearch;
      })
      .slice()
      .reverse();
  }, [orders, search, activeFilter]);

  const clearFilters = () => {
    setSearch("");
    setActiveFilter("All");
  };

  const hasActiveFilters =
    search.trim() !== "" || activeFilter !== "All";

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Page heading */}
      <View style={css.heading}>
        <View style={css.headingText}>
          <Text style={styles.title}>Laundry Orders</Text>
          <Text style={styles.muted}>
            Search, track, and manage laundry orders.
          </Text>
        </View>
      </View>

      <AppButton
        title="+ Create New Order"
        onPress={() => router.push("/create-order")}
      />

      {/* Search and filter panel */}
      <View style={css.filterPanel}>
        <Text style={css.sectionTitle}>Find an Order</Text>

        <View style={css.searchBox}>
          <Ionicons
            name="search-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            style={css.searchInput}
            placeholder="Search name, order ID, or service..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search laundry orders"
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={10}
            >
              <Ionicons
                name="close-circle"
                size={21}
                color="#94A3B8"
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={css.filterLabel}>Filter by Status</Text>

        <View style={css.filterContainer}>
          {FILTERS.map((filter) => {
            const selected = activeFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[
                  css.filterButton,
                  selected && css.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    css.filterButtonText,
                    selected && css.filterButtonTextActive,
                  ]}
                >
                  {filter} ({statusCounts[filter]})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={css.resultsRow}>
          <Text style={css.resultsText}>
            Showing {filteredOrders.length} of {orders.length} orders
          </Text>

          {hasActiveFilters && (
            <TouchableOpacity
              onPress={clearFilters}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
              style={css.clearButton}
            >
              <Ionicons
                name="refresh-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={css.clearText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Empty state */}
      {orders.length === 0 && (
        <View style={css.emptyCard}>
          <Ionicons
            name="basket-outline"
            size={44}
            color="#94A3B8"
          />
          <Text style={css.emptyTitle}>No Orders Yet</Text>
          <Text style={css.emptyDescription}>
            Create your first laundry order to get started.
          </Text>
        </View>
      )}

      {/* No matching results */}
      {orders.length > 0 && filteredOrders.length === 0 && (
        <View style={css.emptyCard}>
          <Ionicons
            name="search-outline"
            size={44}
            color="#94A3B8"
          />
          <Text style={css.emptyTitle}>No Matching Orders</Text>
          <Text style={css.emptyDescription}>
            Try a different search term or status filter.
          </Text>

          <TouchableOpacity
            onPress={clearFilters}
            style={css.resetButton}
          >
            <Text style={css.resetButtonText}>
              Show All Orders
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filtered orders */}
      {filteredOrders.map((order) => {
        const index = STATUS_FLOW.indexOf(order.status);
        const next = STATUS_FLOW[index + 1];

        return (
          <View key={order.id} style={styles.card}>
            <View style={css.orderHeader}>
              <View style={css.orderHeaderText}>
                <Text style={css.id}>{order.id}</Text>
                <Text style={css.name}>
                  {order.customerName}
                </Text>
              </View>

              <View
                style={[
                  css.statusBadge,
                  order.status === "Completed"
                    ? css.completedBadge
                    : order.status === "Ready for Pickup"
                    ? css.readyBadge
                    : order.status === "Ongoing"
                    ? css.ongoingBadge
                    : css.pendingBadge,
                ]}
              >
                <Text
                  style={[
                    css.statusBadgeText,
                    order.status === "Completed"
                      ? css.completedText
                      : order.status === "Ready for Pickup"
                      ? css.readyText
                      : order.status === "Ongoing"
                      ? css.ongoingText
                      : css.pendingText,
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={css.divider} />

            <View style={css.detailRow}>
              <Text style={css.detailLabel}>Service</Text>
              <Text style={css.detailValue}>
                {order.serviceName}
              </Text>
            </View>

            <View style={css.detailRow}>
              <Text style={css.detailLabel}>Weight</Text>
              <Text style={css.detailValue}>
                {order.weight} kg
              </Text>
            </View>

            <View style={css.detailRow}>
              <Text style={css.detailLabel}>Total</Text>
              <Text style={css.totalValue}>
                {peso(order.total)}
              </Text>
            </View>

            <View style={css.detailRow}>
              <Text style={css.detailLabel}>Payment</Text>
              <Text
                style={[
                  css.paymentText,
                  {
                    color:
                      order.paymentStatus === "Paid"
                        ? "#15803D"
                        : "#B45309",
                  },
                ]}
              >
                {order.paymentStatus}
              </Text>
            </View>

            <View style={css.statusBox}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={colors.primary}
              />
              <Text style={css.status}>
                Current Status: {order.status}
              </Text>
            </View>

            {/* Existing payment functionality */}
            {order.paymentStatus !== "Paid" && (
              <AppButton
                title="Record Payment"
                onPress={() =>
                  router.push({
                    pathname: "/payment",
                    params: { id: order.id },
                  })
                }
              />
            )}

            {/* Existing order status functionality */}
            {next && (
              <AppButton
                title={`Mark as ${next}`}
                secondary
                onPress={() => {
                  const success = updateStatus(order.id);

                  if (
                    !success &&
                    order.status === "Ready for Pickup"
                  ) {
                    if (typeof window !== "undefined") {
                      window.alert(
                        "Full payment is required before release."
                      );
                    }
                  }
                }}
              />
            )}

            {/* Existing receipt functionality */}
            {order.paymentStatus === "Paid" && (
              <AppButton
                title="View Receipt"
                secondary
                onPress={() =>
                  router.push({
                    pathname: "/receipt",
                    params: { id: order.id },
                  })
                }
              />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const css = StyleSheet.create({
  heading: {
    marginBottom: 6,
  },

  headingText: {
    flex: 1,
  },

  filterPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginTop: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 13,
    minHeight: 50,
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    paddingVertical: 12,
    paddingHorizontal: 10,
    outlineStyle: "none",
  } as any,

  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 10,
  },

  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  filterButtonTextActive: {
    color: "#FFFFFF",
  },

  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },

  resultsText: {
    fontSize: 12,
    color: "#64748B",
  },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
  },

  clearText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 35,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 8,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 14,
  },

  emptyDescription: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 9,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 18,
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 10,
  },

  orderHeaderText: {
    flex: 1,
    minWidth: 120,
  },

  id: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  name: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 6,
    marginBottom: 10,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },

  pendingText: {
    color: "#92400E",
  },

  ongoingBadge: {
    backgroundColor: "#DBEAFE",
  },

  ongoingText: {
    color: "#1D4ED8",
  },

  readyBadge: {
    backgroundColor: "#F3E8FF",
  },

  readyText: {
    color: "#7E22CE",
  },

  completedBadge: {
    backgroundColor: "#DCFCE7",
  },

  completedText: {
    color: "#166534",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginVertical: 5,
  },

  detailLabel: {
    fontSize: 13,
    color: "#64748B",
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    textAlign: "right",
    flexShrink: 1,
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },

  paymentText: {
    fontSize: 13,
    fontWeight: "700",
  },

  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 9,
    marginVertical: 15,
  },

  status: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
    flexShrink: 1,
  },
});
