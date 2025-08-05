import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trackShipment } from '../services/mockApi';
import { Shipment, ShipmentStatus } from '../types';
import Card from '../components/ui/Card';

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "w-8 h-8 mr-4";
    if (status.toLowerCase().includes('delivered')) return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-green-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    if (status.toLowerCase().includes('transit')) return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-blue-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h2m11-10h2a1 1 0 011 1v10h-2M3 11h10a1 1 0 011 1v1m-1 1H3" /></svg>;
    if (status.toLowerCase().includes('booked')) return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-yellow-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const TrackingProgressBar: React.FC<{ history: ShipmentStatus[] }> = ({ history }) => {
    const statuses = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered'];
    const latestStatus = history[history.length - 1]?.status || '';
    let currentStep = statuses.findIndex(s => latestStatus.toLowerCase().includes(s.toLowerCase()));
    if (currentStep === -1) currentStep = 0; else currentStep += 1;

    return (
        <div className="w-full px-4 sm:px-8 my-8">
            <div className="relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-nova-gray/30 -translate-y-1/2"></div>
                <div className="absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2 transition-all duration-500" style={{ width: `${((currentStep-1)/(statuses.length-1)) * 100}%`, background: 'linear-gradient(to right, #FFD700, #D90429)' }}></div>
                <div className="flex justify-between items-center">
                    {statuses.map((status, index) => {
                        const isActive = index < currentStep;
                        return (
                            <div key={status} className="relative flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-500 ${isActive ? 'bg-nova-red border-nova-red' : 'bg-nova-dark border-nova-gray'}`}></div>
                                <p className={`mt-2 text-xs sm:text-sm text-center transition-colors duration-500 ${isActive ? 'text-nova-light font-semibold' : 'text-nova-gray'}`}>{status}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const TrackingTimeline: React.FC<{ history: ShipmentStatus[] }> = ({ history }) => (
    <div className="mt-6">
        <ol className="relative border-l-2 border-nova-gray/30">
            {[...history].reverse().map((item, index) => (
                <li key={index} className="mb-10 ml-8">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-nova-red rounded-full -left-3 ring-8 ring-nova-dark-200">
                        <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-nova-light">{item.status}</h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-nova-gray">{new Date(item.timestamp).toLocaleString()}</time>
                    <p className="text-base font-normal text-nova-gray"><span className="font-semibold">{item.location}:</span> {item.comment}</p>
                </li>
            ))}
        </ol>
    </div>
);

const DetailItem: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-nova-gray">{label}</p>
    <p className="text-base text-nova-light break-all">{value || 'N/A'}</p>
  </div>
);


const TrackingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [trackingNumber, setTrackingNumber] = useState(searchParams.get('id') || '');
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAllDetails, setShowAllDetails] = useState(false);

    const fetchShipment = async (id: string) => {
        if (!id) return;
        setIsLoading(true);
        setError('');
        setShipment(null);
        setShowAllDetails(false);
        try {
            const result = await trackShipment(id);
            if (result) {
                setShipment(result);
            } else {
                setError(`No shipment found with tracking number: ${id}`);
            }
        } catch (err) {
            setError('An error occurred while fetching shipment data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            fetchShipment(idFromUrl);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams({ id: trackingNumber });
    };

    const currentStatus = shipment?.statusHistory[shipment.statusHistory.length - 1];

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-nova-light mb-8 text-center">Track Your Shipment</h1>
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
                <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter Tracking Number"
                    className="w-full bg-nova-dark-200 border border-nova-gray/30 rounded-lg p-4 text-nova-light focus:ring-2 focus:ring-nova-red focus:border-nova-red transition duration-200 outline-none placeholder-nova-gray"
                />
                <button type="submit" className="bg-nova-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                    {isLoading ? 'Searching...' : 'Track'}
                </button>
            </form>

            {isLoading && <div className="text-center p-8"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-nova-red mx-auto"></div></div>}
            {error && <Card className="!bg-red-900/50 text-red-200 text-center max-w-2xl mx-auto">{error}</Card>}
            
            {shipment && currentStatus && (
                <Card className="!p-6 md:!p-8">
                    <div className="border-b border-nova-gray/20 pb-6 mb-6">
                        <p className="text-nova-gray">Tracking Number</p>
                        <h2 className="text-3xl font-bold text-nova-gold tracking-widest">{shipment.trackingNumber}</h2>
                        <div className="mt-4 flex items-center">
                            <StatusIcon status={currentStatus.status} />
                            <p className="text-2xl font-semibold text-nova-light">{currentStatus.status}</p>
                        </div>
                    </div>

                    <TrackingProgressBar history={shipment.statusHistory} />

                    <div className="mt-8 border-b border-nova-gray/20 pb-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                             <DetailItem label="Sender" value={shipment.sender.name} />
                             <DetailItem label="Receiver" value={shipment.receiver.name} />
                             <DetailItem label="Origin" value={shipment.origin} />
                             <DetailItem label="Destination" value={shipment.destination} />
                             <DetailItem label="Booking Date" value={new Date(shipment.createdAt).toLocaleDateString()} />
                             <DetailItem label="Expected Delivery" value={new Date(shipment.packageInfo.expectedDeliveryDate).toLocaleDateString()} />
                        </div>
                    </div>

                    <div className="text-center border-b border-nova-gray/20">
                         <button 
                            onClick={() => setShowAllDetails(!showAllDetails)}
                            className="flex items-center justify-center w-full py-4 text-nova-gold hover:text-white transition-colors duration-300 font-semibold text-lg"
                         >
                            <span>{showAllDetails ? 'Hide Full Details' : 'Show Full Details'}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ml-2 transition-transform duration-300 ${showAllDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                         </button>
                    </div>
                    
                    {/* Collapsible Details */}
                    <div className={`transition-all duration-700 ease-in-out overflow-hidden ${showAllDetails ? 'max-h-[1000px] opacity-100 pt-6' : 'max-h-0 opacity-0'}`}>
                        <div className="border-b border-nova-gray/20 pb-6 mb-6">
                            {/* Sender & Receiver Info */}
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                                <div>
                                    <h3 className="text-2xl font-semibold text-nova-red mb-4">Sender Information</h3>
                                    <div className="space-y-4">
                                        <DetailItem label="Address" value={shipment.sender.address} />
                                        <DetailItem label="Email" value={shipment.sender.email} />
                                        <DetailItem label="Phone" value={shipment.sender.phone} />
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="text-2xl font-semibold text-nova-red mb-4">Receiver Information</h3>
                                    <div className="space-y-4">
                                        <DetailItem label="Address" value={shipment.receiver.address} />
                                        <DetailItem label="Email" value={shipment.receiver.email} />
                                        <DetailItem label="Phone" value={shipment.receiver.phone} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Package & Carrier Info */}
                            <div>
                                <h3 className="text-2xl font-bold text-nova-light mb-4">Package &amp; Carrier Information</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <DetailItem label="Weight" value={`${shipment.packageInfo.weight} kg`} />
                                    <DetailItem label="Dimensions" value={`${shipment.packageInfo.dimensions} cm`} />
                                    <DetailItem label="Product Type" value={shipment.packageInfo.product} />
                                    <DetailItem label="Quantity" value={shipment.packageInfo.quantity} />
                                    <DetailItem label="Shipment Type" value={shipment.packageInfo.shipmentType} />
                                    <DetailItem label="Mode" value={shipment.packageInfo.mode} />
                                    <DetailItem label="Courier" value={shipment.packageInfo.courier} />
                                    <DetailItem label="Carrier" value={shipment.packageInfo.carrier} />
                                    <DetailItem label="Carrier Ref #" value={shipment.packageInfo.carrierRefNo} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments section - now always visible */}
                    {shipment.packageInfo.comments && (
                        <div className="mt-8 border-t border-nova-gray/20 pt-6">
                            <h3 className="text-2xl font-bold text-nova-light mb-4">Special Instructions</h3>
                            <p className="text-nova-gray bg-nova-dark p-4 rounded-lg italic border border-nova-gray/20">{shipment.packageInfo.comments}</p>
                        </div>
                    )}
                    
                    <div className="border-t border-nova-gray/20 mt-8 pt-6">
                        <h3 className="text-2xl font-bold text-nova-light mb-4">Shipment History</h3>
                        <TrackingTimeline history={shipment.statusHistory} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TrackingPage;