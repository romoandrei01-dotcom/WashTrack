
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Role = "Staff" | "Owner/Admin" | null;

export type OrderStatus =
  | "Pending"
  | "Ongoing"
  | "Ready for Pickup"
  | "Completed";

export type Customer = {
  id: string;
  name: string;
  phone: string;
};

export type Service = {
  id: string;
  name: string;
  price: number;
};

export type LaundryOrder = {
  id: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  weight: number;
  total: number;
  status: OrderStatus;
  paymentAmount: number;
  paymentMethod: string;
  paymentStatus: "Unpaid" | "Partial" | "Paid";
  createdAt: string;
};

type Store = {
  role: Role;
  loaded: boolean;
  customers: Customer[];
  services: Service[];
  orders: LaundryOrder[];

  login: (role: Exclude<Role, null>) => void;
  logout: () => void;

  addCustomer: (name: string, phone: string) => void;
  addService: (name: string, price: number) => void;
  updateService: (id: string, price: number) => void;

  addOrder: (
    customerId: string,
    serviceId: string,
    weight: number
  ) => string | null;

  updateStatus: (id: string) => boolean;

  recordPayment: (
    id: string,
    amount: number,
    method: string
  ) => boolean;
};

const Context = createContext<Store | null>(null);

const KEY = "washtrack_group6_v1";

export const STATUS_FLOW: OrderStatus[] = [
  "Pending",
  "Ongoing",
  "Ready for Pickup",
  "Completed",
];

// Demonstration rates only; confirm with stakeholders.
const defaultServices: Service[] = [
  {
    id: "S1",
    name: "Wash & Fold",
    price: 60,
  },
  {
    id: "S2",
    name: "Wash & Dry",
    price: 75,
  },
  {
    id: "S3",
    name: "Premium Laundry",
    price: 100,
  },
];

// Used for customer and service IDs.
function newId(prefix: string) {
  return (
    prefix +
    "-" +
    Date.now().toString() +
    Math.random().toString(36).slice(2, 6)
  );
}

// Finds the highest existing WT order number.
function getHighestOrderNumber(
  orders: LaundryOrder[]
): number {
  return orders.reduce((highest, order) => {
    const match = /^WT-(\d+)$/.exec(order.id);

    if (!match) {
      return highest;
    }

    const number = Number(match[1]);

    return Math.max(highest, number);
  }, 0);
}

// Generates shorter order IDs.
// Examples: WT-001, WT-002, WT-003.
function formatOrderId(number: number): string {
  return `WT-${String(number).padStart(3, "0")}`;
}

export function WashTrackProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [role, setRole] = useState<Role>(null);

  const [loaded, setLoaded] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [services, setServices] =
    useState<Service[]>(defaultServices);

  const [orders, setOrders] = useState<LaundryOrder[]>([]);

  // Keep the next order number separately so IDs
  // are not reused after orders are removed.
  const nextOrderNumber = useRef(1);

  const [orderCounter, setOrderCounter] = useState(1);

  // Load saved records when the application starts.
  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(KEY);

        if (raw) {
          const data = JSON.parse(raw);

          const savedCustomers: Customer[] =
            data.customers ?? [];

          const savedServices: Service[] =
            data.services ?? defaultServices;

          const savedOrders: LaundryOrder[] =
            data.orders ?? [];

          setCustomers(savedCustomers);
          setServices(savedServices);
          setOrders(savedOrders);

          const highestExisting =
            getHighestOrderNumber(savedOrders);

          const savedCounter =
            Number(data.orderCounter);

          const nextNumber = Math.max(
            highestExisting + 1,
            Number.isSafeInteger(savedCounter) &&
              savedCounter > 0
              ? savedCounter
              : 1
          );

          nextOrderNumber.current = nextNumber;
          setOrderCounter(nextNumber);
        }
      } catch (error) {
        console.warn(
          "Could not load saved records:",
          error
        );
      } finally {
        setLoaded(true);
      }
    }

    load();
  }, []);

  // Save records automatically.
  useEffect(() => {
    if (!loaded) {
      return;
    }

    AsyncStorage.setItem(
      KEY,
      JSON.stringify({
        customers,
        services,
        orders,
        orderCounter,
      })
    ).catch(console.warn);
  }, [
    customers,
    services,
    orders,
    orderCounter,
    loaded,
  ]);

  // Register a new customer.
  function addCustomer(
    name: string,
    phone: string
  ) {
    setCustomers((previous) => [
      ...previous,
      {
        id: newId("C"),
        name: name.trim(),
        phone: phone.trim(),
      },
    ]);
  }

  // Add a new laundry service.
  function addService(
    name: string,
    price: number
  ) {
    setServices((previous) => [
      ...previous,
      {
        id: newId("S"),
        name: name.trim(),
        price,
      },
    ]);
  }

  // Update a service price.
  function updateService(
    id: string,
    price: number
  ) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === id
          ? {
              ...service,
              price,
            }
          : service
      )
    );
  }

  // Create a laundry order.
  function addOrder(
    customerId: string,
    serviceId: string,
    weight: number
  ): string | null {
    const customer = customers.find(
      (item) => item.id === customerId
    );

    const service = services.find(
      (item) => item.id === serviceId
    );

    if (
      !loaded ||
      !customer ||
      !service ||
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      return null;
    }

    // Generate the next sequential order ID.
    const number = nextOrderNumber.current;

    const id = formatOrderId(number);

    nextOrderNumber.current = number + 1;

    setOrderCounter(nextOrderNumber.current);

    const order: LaundryOrder = {
      id,
      customerId,
      customerName: customer.name,
      serviceName: service.name,
      weight,
      total:
        Math.round(
          service.price * weight * 100
        ) / 100,
      status: "Pending",
      paymentAmount: 0,
      paymentMethod: "",
      paymentStatus: "Unpaid",
      createdAt: new Date().toISOString(),
    };

    setOrders((previous) => [
      ...previous,
      order,
    ]);

    return id;
  }

  // Move an order to the next status.
  function updateStatus(id: string): boolean {
    const order = orders.find(
      (item) => item.id === id
    );

    if (!order) {
      return false;
    }

    const index = STATUS_FLOW.indexOf(
      order.status
    );

    if (index >= STATUS_FLOW.length - 1) {
      return false;
    }

    // Full payment is required before release.
    if (
      order.status === "Ready for Pickup" &&
      order.paymentStatus !== "Paid"
    ) {
      return false;
    }

    setOrders((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: STATUS_FLOW[index + 1],
            }
          : item
      )
    );

    return true;
  }

  // Record a customer payment.
  function recordPayment(
    id: string,
    amount: number,
    method: string
  ): boolean {
    const order = orders.find(
      (item) => item.id === id
    );

    if (
      !order ||
      order.paymentStatus === "Paid"
    ) {
      return false;
    }

    const remaining =
      Math.round(
        (order.total - order.paymentAmount) *
          100
      ) / 100;

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > remaining ||
      !method.trim()
    ) {
      return false;
    }

    setOrders((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const paid =
          Math.round(
            (item.paymentAmount + amount) *
              100
          ) / 100;

        return {
          ...item,
          paymentAmount: paid,
          paymentMethod: method,
          paymentStatus:
            paid >= item.total
              ? "Paid"
              : "Partial",
        };
      })
    );

    return true;
  }

  return (
    <Context.Provider
      value={{
        role,
        loaded,
        customers,
        services,
        orders,

        login: setRole,

        logout: () => setRole(null),

        addCustomer,
        addService,
        updateService,

        addOrder,
        updateStatus,
        recordPayment,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useWashTrack() {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      "WashTrackProvider is missing"
    );
  }

  return context;
}
