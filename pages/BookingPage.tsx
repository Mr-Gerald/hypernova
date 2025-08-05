
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { bookShipment } from '../services/mockApi';
import { Shipment } from '../types';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { Link } from 'react-router-dom';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';

const initialFormData = {
    senderName: '', senderAddress: '', senderEmail: '', senderPhone: '',
    receiverName: '', receiverAddress: '', receiverEmail: '', receiverPhone: '',
    origin: '', destination: '',
    weight: '', dimensions: '',
    shipmentType: 'Express', courier: 'HyperNova Express', packageType: 'Box',
    mode: 'Air', product: 'General Goods', quantity: '1',
    carrier: '', carrierRefNo: '',
    departureTime: '', pickupDate: '', expectedDeliveryDate: '',
    comments: ''
};

const BookingPage: React.FC = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookedShipment, setBookedShipment] = useState<Shipment | null>(null);

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const shipmentData = {
                userId: user!.id,
                sender: { name: formData.senderName, address: formData.senderAddress, email: formData.senderEmail, phone: formData.senderPhone },
                receiver: { name: formData.receiverName, address: formData.receiverAddress, email: formData.receiverEmail, phone: formData.receiverPhone },
                origin: formData.origin,
                destination: formData.destination,
                packageInfo: { 
                    weight: parseFloat(formData.weight), 
                    dimensions: formData.dimensions,
                    shipmentType: formData.shipmentType,
                    courier: formData.courier,
                    packageType: formData.packageType,
                    mode: formData.mode,
                    product: formData.product,
                    quantity: parseInt(formData.quantity, 10),
                    carrier: formData.carrier,
                    carrierRefNo: formData.carrierRefNo,
                    departureTime: formData.departureTime,
                    pickupDate: formData.pickupDate,
                    expectedDeliveryDate: formData.expectedDeliveryDate,
                    comments: formData.comments,
                },
            };
            const newShipment = await bookShipment(shipmentData as Omit<Shipment, '_id' | 'trackingNumber' | 'createdAt' | 'statusHistory'>);
            setBookedShipment(newShipment);
            setIsModalOpen(true);
            setFormData(initialFormData);
        } catch (err) {
            setError('Failed to book shipment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-nova-light mb-8">Book a New Shipment</h1>
                <form onSubmit={handleSubmit}>
                    <Card className="!p-8">
                        {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md text-center mb-6">{error}</p>}
                        
                        {/* Sender & Receiver Info */}
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-semibold text-nova-red border-b border-nova-gray/20 pb-2">Sender Information</h3>
                                <Input label="Full Name" name="senderName" value={formData.senderName} onChange={handleChange} required />
                                <Input label="Address" name="senderAddress" value={formData.senderAddress} onChange={handleChange} required />
                                <Input label="Email Address" type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} required />
                                <Input label="Phone Number" type="tel" name="senderPhone" value={formData.senderPhone} onChange={handleChange} required />
                                <Input label="Origin City" name="origin" value={formData.origin} onChange={handleChange} required />
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-2xl font-semibold text-nova-red border-b border-nova-gray/20 pb-2">Receiver Information</h3>
                                <Input label="Full Name" name="receiverName" value={formData.receiverName} onChange={handleChange} required />
                                <Input label="Address" name="receiverAddress" value={formData.receiverAddress} onChange={handleChange} required />
                                <Input label="Email Address" type="email" name="receiverEmail" value={formData.receiverEmail} onChange={handleChange} required />
                                <Input label="Phone Number" type="tel" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} required />
                                <Input label="Destination City" name="destination" value={formData.destination} onChange={handleChange} required />
                            </div>
                        </div>
                        
                        {/* Package Info */}
                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold text-nova-red border-b border-nova-gray/20 pb-2 mb-6">Package &amp; Shipment Information</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Select label="Type of Shipment" name="shipmentType" value={formData.shipmentType} onChange={handleChange} required>
                                    <option>Express</option>
                                    <option>Standard</option>
                                    <option>Economy</option>
                                </Select>
                                <Select label="Courier" name="courier" value={formData.courier} onChange={handleChange} required>
                                    <option>HyperNova Express</option>
                                    <option>Partner Carrier</option>
                                </Select>
                                <Select label="Package Type" name="packageType" value={formData.packageType} onChange={handleChange} required>
                                    <option>Box</option>
                                    <option>Envelope</option>
                                    <option>Pallet</option>
                                    <option>Crate</option>
                                </Select>
                                <Select label="Mode" name="mode" value={formData.mode} onChange={handleChange} required>
                                    <option>Air</option>
                                    <option>Sea</option>
                                    <option>Ground</option>
                                </Select>
                                <Select label="Product" name="product" value={formData.product} onChange={handleChange} required>
                                    <option>General Goods</option>
                                    <option>Documents</option>
                                    <option>Electronics</option>
                                    <option>Perishables</option>
                                    <option>Fragile</option>
                                </Select>
                                <Input label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required min="1" />
                                <Input label="Weight (kg)" name="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange} required />
                                <Input label="Dimensions (LxWxH cm)" name="dimensions" placeholder="e.g., 20x15x10" value={formData.dimensions} onChange={handleChange} required />
                                <Input label="Carrier (Optional)" name="carrier" value={formData.carrier} onChange={handleChange} placeholder="e.g., HyperNova Ground" />
                                <Input label="Carrier Reference No. (Optional)" name="carrierRefNo" value={formData.carrierRefNo} onChange={handleChange} />
                                <Input label="Departure Time" name="departureTime" type="datetime-local" value={formData.departureTime} onChange={handleChange} required />
                                <Input label="Pickup Date" name="pickupDate" type="date" value={formData.pickupDate} onChange={handleChange} required />
                                <Input label="Expected Delivery Date" name="expectedDeliveryDate" type="date" value={formData.expectedDeliveryDate} onChange={handleChange} required />
                                
                                <div className="md:col-span-2 lg:col-span-3">
                                  <Textarea label="Comments" name="comments" value={formData.comments} onChange={handleChange} placeholder="Add any special instructions..."/>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button type="submit" isLoading={isLoading} className="max-w-sm mx-auto">
                                Confirm & Book Shipment
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Booking Confirmation">
                {bookedShipment && (
                    <div className="text-nova-light space-y-4">
                        <p className="text-lg">Thank you for booking with HyperNova Express!</p>
                        <p className="text-nova-gray">An email confirmation has been sent to you.</p>
                        <div className="bg-nova-dark p-4 rounded-lg my-4 border border-nova-gold/50">
                            <p className="text-sm text-nova-gray">Your Tracking Number is:</p>
                            <p className="text-2xl font-bold text-nova-gold tracking-widest">{bookedShipment.trackingNumber}</p>
                        </div>
                        <div className="text-sm">
                            <p><strong>Origin:</strong> {bookedShipment.origin}</p>
                            <p><strong>Destination:</strong> {bookedShipment.destination}</p>
                            <p><strong>Date:</strong> {new Date(bookedShipment.createdAt).toLocaleString()}</p>
                        </div>
                         <Link to={`/track?id=${bookedShipment.trackingNumber}`}>
                            <Button className="mt-4" onClick={() => setIsModalOpen(false)}>
                                Track My Shipment
                            </Button>
                        </Link>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default BookingPage;