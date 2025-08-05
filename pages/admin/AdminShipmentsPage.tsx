
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllShipments } from '../../services/mockApi';
import { Shipment } from '../../types';
import Card from '../../components/ui/Card';

const AdminShipmentsPage: React.FC = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAllShipments().then(data => {
            setShipments(data);
            setIsLoading(false);
        });
    }, []);

    const filteredShipments = useMemo(() => {
        return shipments.filter(s => 
            s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.receiver.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [shipments, searchTerm]);

    const getStatusChip = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('delivered')) return 'bg-green-500/20 text-green-300';
        if (lowerStatus.includes('transit')) return 'bg-blue-500/20 text-blue-300';
        if (lowerStatus.includes('booked')) return 'bg-yellow-500/20 text-yellow-300';
        return 'bg-gray-500/20 text-gray-300';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-nova-light">Manage Shipments</h1>
                 <Link to="/admin/dashboard" className="text-nova-gold hover:underline">
                    &larr; Back to Dashboard
                </Link>
            </div>
            
            <Card>
                <input
                    type="text"
                    placeholder="Search by Tracking #, Sender, or Receiver..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-nova-dark p-3 rounded-lg border border-nova-gray/30 mb-6 focus:ring-2 focus:ring-nova-red outline-none"
                />
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-nova-gray/30 text-nova-gray uppercase">
                            <tr>
                                <th className="p-3">Tracking #</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Origin</th>
                                <th className="p-3">Destination</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center p-8">Loading shipments...</td></tr>
                            ) : filteredShipments.map(s => (
                                <tr key={s._id} className="border-b border-nova-dark-200 hover:bg-nova-dark-200/50">
                                    <td className="p-3 font-mono text-nova-gold">{s.trackingNumber}</td>
                                    <td className="p-3 text-nova-gray">{new Date(s.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">{s.origin}</td>
                                    <td className="p-3">{s.destination}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusChip(s.statusHistory[s.statusHistory.length - 1].status)}`}>
                                            {s.statusHistory[s.statusHistory.length - 1].status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <Link to={`/admin/shipments/update/${s.trackingNumber}`} className="text-nova-red hover:underline font-bold">
                                            Update
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminShipmentsPage;
