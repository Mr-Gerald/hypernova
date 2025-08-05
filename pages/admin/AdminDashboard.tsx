
import React, { useState, useEffect } from 'react';
import { getDashboardAnalytics } from '../../services/mockApi';
import { generateLogisticsInsights } from '../../services/geminiService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<{ total: number, active: number, completed: number, topDestinations: any[] } | null>(null);
    const [insights, setInsights] = useState('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);

    useEffect(() => {
        getDashboardAnalytics().then(setAnalytics);
    }, []);

    const handleGenerateInsights = async () => {
        setIsLoadingInsights(true);
        setInsights('');
        const result = await generateLogisticsInsights();
        setInsights(result);
        setIsLoadingInsights(false);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-nova-light">Admin Dashboard</h1>
                <Link to="/admin/shipments">
                    <Button>Manage Shipments</Button>
                </Link>
            </div>

            {analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <h3 className="text-nova-gray">Total Shipments</h3>
                        <p className="text-4xl font-bold text-nova-red">{analytics.total}</p>
                    </Card>
                    <Card>
                        <h3 className="text-nova-gray">Active Shipments</h3>
                        <p className="text-4xl font-bold text-blue-400">{analytics.active}</p>
                    </Card>
                    <Card>
                        <h3 className="text-nova-gray">Completed Shipments</h3>
                        <p className="text-4xl font-bold text-green-400">{analytics.completed}</p>
                    </Card>
                    <Card>
                        <h3 className="text-nova-gray">Top Destination</h3>
                        <p className="text-3xl font-bold text-nova-gold">{analytics.topDestinations[0]?.name || 'N/A'}</p>
                        <p className="text-sm text-nova-gray">{analytics.topDestinations[0]?.count || 0} shipments</p>
                    </Card>
                </div>
            ) : <p>Loading analytics...</p>}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1">
                    <h2 className="text-2xl font-bold mb-4">Top Destinations</h2>
                    <ul className="space-y-3">
                        {analytics?.topDestinations.map(d => (
                            <li key={d.name} className="flex justify-between items-center bg-nova-dark p-3 rounded-lg">
                                <span className="font-semibold">{d.name}</span>
                                <span className="text-nova-gold font-bold">{d.count}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                 <Card className="lg:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold">AI-Powered Logistics Insights</h2>
                        <Button onClick={handleGenerateInsights} isLoading={isLoadingInsights} className="!w-auto !py-2">Generate</Button>
                    </div>
                    {isLoadingInsights && <div className="text-center p-4"><div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-nova-red mx-auto"></div></div>}
                    {insights && (
                        <div className="bg-nova-dark p-4 rounded-lg whitespace-pre-wrap text-nova-gray font-mono text-sm">
                            {insights}
                        </div>
                    )}
                     {!insights && !isLoadingInsights && <p className="text-nova-gray text-center p-8">Click "Generate" to get the latest market analysis from our AI.</p>}
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
