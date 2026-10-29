
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext, useEffect,
    useState
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
  { id: "S1", name: "Wash & Fold", price: 60 },
  { id: "S2", name: "Wash & Dry", price: 75 },
  { id: "S3", name: "Premium Laundry", price: 100 },
];

function newId(prefix: string) {
  return prefix + "-" + Date.now().toString() +
    Math.random().toString(36).slice(2, 6);
}

export function WashTrackProvider({
  children
}: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [loaded, setLoaded] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [orders, setOrders] = useState<LaundryOrder[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setCustomers(data.customers ?? []);
          setServices(data.services ?? defaultServices);
          setOrders(data.orders ?? []);
        }
      } catch (e) {
        console.warn("Could not load saved records:", e);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      KEY,
      JSON.stringify({ customers, services, orders })
    ).catch(console.warn);
  }, [customers, services, orders, loaded]);

  function addCustomer(name: string, phone: string) {
    setCustomers(prev => [
      ...prev,
      { id: newId("C"), name: name.trim(), phone: phone.trim() }
    ]);
  }

  function addService(name: string, price: number) {
    setServices(prev => [
      ...prev,
      { id: newId("S"), name: name.trim(), price }
    ]);
  }

  function updateService(id: string, price: number) {
    setServices(prev =>
      prev.map(s => s.id === id ? { ...s, price } : s)
    );
  }

  function addOrder(
    customerId: string,
    serviceId: string,
    weight: number
  ): string | null {
    const customer = customers.find(c => c.id === customerId);
    const service = services.find(s => s.id === serviceId);

    if (!customer || !service || !Number.isFinite(weight) || weight <= 0) {
      return null;
    }

    const id = newId("WT");
    const order: LaundryOrder = {
      id,
      customerId,
      customerName: customer.name,
      serviceName: service.name,
      weight,
      total: Math.round(service.price * weight * 100) / 100,
      status: "Pending",
      paymentAmount: 0,
      paymentMethod: "",
      paymentStatus: "Unpaid",
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [...prev, order]);
    return id;
  }

  function updateStatus(id: string): boolean {
    const order = orders.find(o => o.id === id);
    if (!order) return false;

    const index = STATUS_FLOW.indexOf(order.status);
    if (index >= STATUS_FLOW.length - 1) return false;

    // Require full payment before releasing laundry.
    if (
      order.status === "Ready for Pickup" &&
      order.paymentStatus !== "Paid"
    ) return false;

    setOrders(prev => prev.map(o =>
      o.id === id
        ? { ...o, status: STATUS_FLOW[index + 1] }
        : o
    ));
    return true;
  }

  function recordPayment(
    id: string,
    amount: number,
    method: string
  ): boolean {
    const order = orders.find(o => o.id === id);
    if (!order || order.paymentStatus === "Paid") return false;

    const remaining = Math.round(
      (order.total - order.paymentAmount) * 100
    ) / 100;

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > remaining ||
      !method
    ) return false;

    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const paid = Math.round((o.paymentAmount + amount) * 100) / 100;
      return {
        ...o,
        paymentAmount: paid,
        paymentMethod: method,
        paymentStatus: paid >= o.total ? "Paid" : "Partial",
      };
    }));
    return true;
  }

  return (
    <Context.Provider value={{
      role, loaded, customers, services, orders,
      login: setRole,
      logout: () => setRole(null),
      addCustomer, addService, updateService,
      addOrder, updateStatus, recordPayment,
    }}>
      {children}
    </Context.Provider>
  );
}

export function useWashTrack() {
  const context = useContext(Context);
  if (!context) throw new Error("WashTrackProvider is missing");
  return context;
}
