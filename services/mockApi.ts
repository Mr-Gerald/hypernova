import { Shipment, ShipmentStatus, User } from '../types';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';

const JSONBIN_API_KEY = "$2a$10$stuoUsO9r288GPVX/sBEB.rYUHGf2GVnBxIDpRj6kADuV/Z871Qzu";
const JSONBIN_BIN_ID = "6891bceaae596e708fc1f829";

if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
    console.error("CRITICAL: JSONBin API Key or Bin ID is not configured. The application will not be able to store or retrieve shipment data.");
}

const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const JSONBIN_API_URL_LATEST = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;


const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Master-Key': JSONBIN_API_KEY!,
    'X-Bin-Versioning': 'false', // Disable versioning to avoid extra reads/writes
});

// Helper function to fetch all shipments from the bin.
const fetchAllShipmentsFromBin = async (): Promise<Shipment[]> => {
    if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
        throw new Error("API service is not configured. Please check your environment variables.");
    }
    try {
        const response = await fetch(JSONBIN_API_URL_LATEST, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch shipments: ${response.status} ${errorText}`);
        }
        // jsonbin returns the data wrapped in `record` for GET /latest
        const data = await response.json();
        return data.record || [];
    } catch (error) {
        console.error('Error in fetchAllShipmentsFromBin:', error);
        throw error;
    }
};

// Helper function to update the entire bin.
const updateShipmentsInBin = async (shipments: Shipment[]): Promise<void> => {
     if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
        throw new Error("API service is not configured. Please check your environment variables.");
    }
    try {
        const response = await fetch(JSONBIN_API_URL, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(shipments),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update shipments: ${response.status} ${errorText}`);
        }
    } catch (error) {
        console.error('Error in updateShipmentsInBin:', error);
        throw error;
    }
};

export const mockLogin = (username: string, password?: string): Promise<{ token: string; user: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        resolve({
          token: 'admin-secret-token',
          user: { id: 'admin01', username: ADMIN_USERNAME, email: 'admin@hypernova.express', isAdmin: true },
        });
      } else if (password) { // Regular user login
        resolve({
          token: 'user-secret-token-for-' + username,
          user: { id: 'user_' + Date.now(), username, email: `${username}@example.com`, isAdmin: false },
        });
      } else { // Signup
         resolve({
          token: 'user-secret-token-for-' + username,
          user: { id: 'user_' + Date.now(), username, email: `${username}@example.com`, isAdmin: false },
        });
      }
    }, 500);
  });
};

export const trackShipment = async (trackingNumber: string): Promise<Shipment | undefined> => {
  const shipments = await fetchAllShipmentsFromBin();
  return shipments.find(s => s.trackingNumber === trackingNumber);
};

export const bookShipment = async (data: Omit<Shipment, '_id' | 'trackingNumber' | 'createdAt' | 'statusHistory'>): Promise<Shipment> => {
    const allShipments = await fetchAllShipmentsFromBin();
    const trackingNumber = `HN${new Date().getFullYear()}${(Math.random() * 9000).toFixed(0).padStart(4, '0')}`;
    const newShipment: Shipment = {
        ...data,
        _id: String(new Date().getTime()), // Use timestamp for unique ID
        trackingNumber,
        createdAt: new Date().toISOString(),
        statusHistory: [{
            timestamp: new Date().toISOString(),
            status: 'Booked',
            location: data.origin,
            comment: 'Shipment created and ready for pickup.'
        }]
    };
    const updatedShipments = [newShipment, ...allShipments];
    await updateShipmentsInBin(updatedShipments);
    return newShipment;
};

export const getAllShipments = async (): Promise<Shipment[]> => {
    const shipments = await fetchAllShipmentsFromBin();
    return [...shipments].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const updateShipmentStatus = async (trackingNumber: string, newStatus: Omit<ShipmentStatus, 'timestamp'>): Promise<Shipment | undefined> => {
    const allShipments = await fetchAllShipmentsFromBin();
    const shipmentIndex = allShipments.findIndex(s => s.trackingNumber === trackingNumber);
    if (shipmentIndex !== -1) {
        const fullStatus: ShipmentStatus = { ...newStatus, timestamp: new Date().toISOString() };
        allShipments[shipmentIndex].statusHistory.push(fullStatus);

        // Overwrite the main package comment with the new status update comment
        if (newStatus.comment) {
            allShipments[shipmentIndex].packageInfo.comments = newStatus.comment;
        }

        await updateShipmentsInBin(allShipments);
        return allShipments[shipmentIndex];
    }
    return undefined;
};

export const getDashboardAnalytics = async (): Promise<{ total: number, active: number, completed: number, topDestinations: {name: string, count: number}[] }> => {
    const mockShipments = await fetchAllShipmentsFromBin();
    const total = mockShipments.length;
    const active = mockShipments.filter(s => s.statusHistory[s.statusHistory.length - 1].status !== 'Delivered').length;
    const completed = total - active;
    
    const destinationCounts = mockShipments.reduce((acc, s) => {
        acc[s.destination] = (acc[s.destination] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topDestinations = Object.entries(destinationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return { total, active, completed, topDestinations };
}