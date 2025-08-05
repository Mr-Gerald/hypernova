
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface ShipmentStatus {
  timestamp: string;
  status: string;
  location: string;
  comment: string;
}

export interface Shipment {
  _id: string;
  trackingNumber: string;
  userId: string;
  sender: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  receiver: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  origin: string;
  destination: string;
  packageInfo: {
    weight: number;
    dimensions: string;
    shipmentType: string;
    courier: string;
    packageType: string;
    mode: string;
    product: string;
    quantity: number;
    carrier: string;
    carrierRefNo: string;
    departureTime: string;
    pickupDate: string;
    expectedDeliveryDate: string;
    comments: string;
  };
  statusHistory: ShipmentStatus[];
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}