
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackShipment, updateShipmentStatus } from '../../services/mockApi';
import { Shipment } from '../../types';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const STATUS_OPTIONS = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered', 'Delayed', 'On Hold', 'Cancelled'];

const AdminUpdateShipmentPage: React.FC = () => {
    const { trackingNumber } = useParams<{ trackingNumber: string }>();
    const navigate = useNavigate();

    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    
    const [newStatus, setNewStatus] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (trackingNumber) {
            trackShipment(trackingNumber).then(data => {
                if (data) {
                    setShipment(data);
                } else {
                    setError('Shipment not found.');
                }
                setIsLoading(false);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackingNumber]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber || !newStatus || !newLocation || !newComment) {
            setError('All fields are required.');
            return;
        }
        setIsUpdating(true);
        setError('');
        try {
            await updateShipmentStatus(trackingNumber, { status: newStatus, location: newLocation, comment: newComment });
            navigate('/admin/shipments');
        } catch (err) {
            setError('Failed to update status.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div className="text-center p-8">Loading shipment details...</div>;
    if (error && !shipment) return <Card className="!bg-red-900/50 text-red-200 text-center">{error}</Card>;
    if (!shipment) return null;

    return (
        <div>
            <h1 className="text-4xl font-bold text-nova-light mb-2">Update Shipment</h1>
            <p className="text-xl text-nova-gold font-mono mb-8">{trackingNumber}</p>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-2xl font-bold mb-4 border-b border-nova-gray/20 pb-2">Add New Status Update</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md text-center">{error}</p>}
                            <Select label="Status" value={newStatus} onChange={e => setNewStatus(e.target.value)} required>
                                <option value="" disabled>Select a status</option>
                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </Select>
                            <Input label="Location" value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="e.g., Central Hub" required/>
                            <Input label="Comment" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="e.g., Departed from facility" required/>
                            <Button type="submit" isLoading={isUpdating}>Add Update</Button>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                     <Card>
                        <h3 className="text-xl font-bold mb-4">Current History</h3>
                        <ul className="space-y-4 max-h-96 overflow-y-auto">
                            {[...shipment.statusHistory].reverse().map((s, i) => (
                                <li key={i} className="border-l-2 border-nova-red pl-3">
                                    <p className="font-bold">{s.status}</p>
                                    <p className="text-sm text-nova-gray">{s.location}</p>
                                    <p className="text-xs text-nova-gray/70">{new Date(s.timestamp).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminUpdateShipmentPage;