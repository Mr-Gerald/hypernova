import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const ServiceCard: React.FC<{imgSrc: string, title: string, children: React.ReactNode}> = ({imgSrc, title, children}) => (
    <div 
        className="relative rounded-xl shadow-lg overflow-hidden p-6 flex flex-col justify-end h-80 bg-cover bg-center transform hover:-translate-y-2 transition-transform duration-300 group"
        style={{ backgroundImage: `url('${imgSrc}')` }}
    >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 text-white">
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-nova-light/90 mt-2 max-w-full">{children}</p>
        </div>
    </div>
);

const TestimonialCard: React.FC<{imgSrc: string, name: string, role: string, children: React.ReactNode, className?: string}> = ({imgSrc, name, role, children, className = ''}) => (
    <Card className={`flex flex-col ${className}`}>
        <p className="text-nova-gray italic flex-grow">"{children}"</p>
        <div className="flex items-center mt-4">
            <img src={imgSrc} alt={name} className="w-12 h-12 rounded-full object-cover mr-4"/>
            <div>
                <p className="font-bold text-nova-light">{name}</p>
                <p className="text-sm text-nova-gold">{role}</p>
            </div>
        </div>
    </Card>
);

const HomePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('track');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [quoteData, setQuoteData] = useState({ origin: '', destination: '', weight: '' });
    const [quoteResult, setQuoteResult] = useState<string | null>(null);
    const [isQuoteLoading, setIsQuoteLoading] = useState(false);
    const navigate = useNavigate();

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingNumber.trim()) {
            navigate(`/track?id=${trackingNumber.trim()}`);
        }
    };

    const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuoteData({ ...quoteData, [e.target.name]: e.target.value });
    };

    const handleGetQuote = (e: React.FormEvent) => {
        e.preventDefault();
        setIsQuoteLoading(true);
        setQuoteResult(null);
        // Simulate API call
        setTimeout(() => {
            const { weight } = quoteData;
            const price = 15 + (parseFloat(weight || '0') * 3.5);
            setQuoteResult(`Estimated Cost: $${price.toFixed(2)}`);
            setIsQuoteLoading(false);
        }, 1500);
    };

    const renderTabs = () => {
        switch (activeTab) {
            case 'quote':
                return (
                    <form onSubmit={handleGetQuote} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="origin" value={quoteData.origin} onChange={handleQuoteChange} placeholder="Origin Postal Code" className="w-full bg-nova-dark-200/80 border border-nova-gray/30 rounded-lg p-3 text-nova-light focus:ring-2 focus:ring-nova-red outline-none placeholder-nova-gray" required />
                            <input type="text" name="destination" value={quoteData.destination} onChange={handleQuoteChange} placeholder="Destination Postal Code" className="w-full bg-nova-dark-200/80 border border-nova-gray/30 rounded-lg p-3 text-nova-light focus:ring-2 focus:ring-nova-red outline-none placeholder-nova-gray" required />
                        </div>
                        <input type="number" name="weight" value={quoteData.weight} onChange={handleQuoteChange} placeholder="Package Weight (kg)" className="w-full bg-nova-dark-200/80 border border-nova-gray/30 rounded-lg p-3 text-nova-light focus:ring-2 focus:ring-nova-red outline-none placeholder-nova-gray" required />
                        <button type="submit" disabled={isQuoteLoading} className="w-full bg-nova-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
                            {isQuoteLoading ? 'Calculating...' : 'Get Quote'}
                        </button>
                        {quoteResult && <p className="text-center font-semibold text-nova-gold pt-2">{quoteResult}</p>}
                    </form>
                );
            case 'book':
                return (
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-nova-light mb-4">Ready to ship with the best?</h3>
                        <p className="text-nova-gray mb-6">Create an account to start booking shipments in minutes.</p>
                        <Link to="/book">
                           <button className="w-full bg-nova-gold hover:bg-yellow-500 text-nova-dark font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                                Book a Shipment Now
                            </button>
                        </Link>
                    </div>
                );
            case 'track':
            default:
                return (
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter Your Tracking Number"
                            className="w-full bg-nova-dark-200/80 border border-nova-gray/30 rounded-lg p-4 text-nova-light focus:ring-2 focus:ring-nova-red focus:border-nova-red transition duration-200 outline-none placeholder-nova-gray"
                            aria-label="Tracking Number"
                        />
                        <button type="submit" className="bg-nova-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                            Track
                        </button>
                    </form>
                );
        }
    };
    
    return (
        <div className="space-y-24 md:space-y-32">
            {/* Hero Section */}
            <section className="relative -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="h-[85vh] md:h-[90vh] bg-cover bg-center" style={{ backgroundImage: "url('https://media.istockphoto.com/id/1929414394/photo/warehouse-manager-overseeing-unloading-of-truck-holding-tablet-looking-at-cargo-details.jpg?s=612x612&w=0&k=20&c=YVTkedUDKgGlU0IB0YL-TRz42zQlPwZ9IpffH6Xs2Xw=')" }}>
                    <div className="absolute inset-0 bg-nova-dark/60"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                        Connecting Your World,
                        <span className="block mt-2 tracking-wider">Seamlessly.</span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-nova-light max-w-3xl mx-auto drop-shadow-md">
                        Your trusted partner for fast, reliable, and secure global logistics solutions.
                    </p>

                    {/* Action Hub */}
                    <div className="mt-10 w-full max-w-2xl bg-nova-dark/70 backdrop-blur-md rounded-xl shadow-2xl p-4 md:p-6">
                        <div className="flex justify-center border-b border-nova-gray/20 mb-4">
                            <button onClick={() => setActiveTab('track')} className={`px-4 py-2 text-sm md:text-base font-semibold transition-colors duration-300 ${activeTab === 'track' ? 'text-nova-red border-b-2 border-nova-red' : 'text-nova-gray hover:text-nova-light'}`}>Track</button>
                            <button onClick={() => setActiveTab('quote')} className={`px-4 py-2 text-sm md:text-base font-semibold transition-colors duration-300 ${activeTab === 'quote' ? 'text-nova-red border-b-2 border-nova-red' : 'text-nova-gray hover:text-nova-light'}`}>Get a Quote</button>
                            <button onClick={() => setActiveTab('book')} className={`px-4 py-2 text-sm md:text-base font-semibold transition-colors duration-300 ${activeTab === 'book' ? 'text-nova-red border-b-2 border-nova-red' : 'text-nova-gray hover:text-nova-light'}`}>Book Shipment</button>
                        </div>
                        <div className="pt-4">
                            {renderTabs()}
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section>
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Our Core Services</h2>
                    <p className="mt-4 text-lg text-nova-gray max-w-3xl mx-auto">From a single document to a full container load, HyperNova provides a solution for every need.</p>
                </div>
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    <ServiceCard imgSrc="https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" title="Express Delivery">
                        Lightning-fast domestic and international parcel service for your time-sensitive shipments.
                    </ServiceCard>
                    <ServiceCard imgSrc="https://images.pexels.com/photos/1089306/pexels-photo-1089306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" title="International Freight">
                        Reliable air and sea freight solutions to connect your business to the global market.
                    </ServiceCard>
                    <ServiceCard imgSrc="https://plus.unsplash.com/premium_photo-1682145409553-75a35479e3cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGxvZ2lzdGljcyUyMHRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D" title="Warehousing">
                        Secure, state-of-the-art facilities for inventory management and fulfillment services.
                    </ServiceCard>
                </div>
            </section>

            {/* How it Works Section */}
            <section>
                 <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Simple &amp; Transparent Process</h2>
                    <p className="mt-4 text-lg text-nova-gray max-w-3xl mx-auto">Getting your package on its way is easier than ever.</p>
                </div>
                <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img 
                            src="https://media.istockphoto.com/id/1502885368/photo/team-engineer-worker-visiting-at-logistics-warehouse-foreman-and-assistant-working-and.jpg?s=612x612&w=0&k=20&c=6IARGfGgExLKaCVWICzveCGHU4K7dhiXtehNSP1xpRQ=" 
                            alt="Team of logistics professionals collaborating" 
                            className="rounded-xl shadow-2xl w-full h-auto object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                       <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-nova-red/20 text-nova-red font-bold text-2xl rounded-full flex items-center justify-center border-2 border-nova-red/30">1</div>
                            <div>
                                <h3 className="text-xl font-bold">Book Your Shipment</h3>
                                <p className="text-nova-gray mt-1">Fill out our simple form with package and destination details using our intuitive 'Get a Quote' or 'Book Shipment' tools.</p>
                            </div>
                        </div>
                         <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-nova-red/20 text-nova-red font-bold text-2xl rounded-full flex items-center justify-center border-2 border-nova-red/30">2</div>
                            <div>
                                <h3 className="text-xl font-bold">We Pick Up &amp; Ship</h3>
                                <p className="text-nova-gray mt-1">Our professional courier will promptly collect your package and integrate it into our high-speed global network.</p>
                            </div>
                        </div>
                         <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-nova-red/20 text-nova-red font-bold text-2xl rounded-full flex items-center justify-center border-2 border-nova-red/30">3</div>
                            <div>
                                <h3 className="text-xl font-bold">Track to Delivery</h3>
                                <p className="text-nova-gray mt-1">Follow your package in real-time from pickup to the recipient's doorstep with our precise tracking system.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Global Network Section */}
            <section className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Our Global Network</h2>
                <p className="mt-4 text-lg text-nova-gray max-w-3xl mx-auto">We connect every corner of the world with precision and speed.</p>
                <div className="mt-8">
                    <img src="https://images.stockcake.com/public/a/c/f/acf83e69-3e39-41b9-a833-e204720c0f31_large/global-network-connectivity-stockcake.jpg" alt="Abstract visualization of a global network" className="w-full h-auto max-w-5xl mx-auto opacity-80 rounded-lg shadow-2xl"/>
                </div>
            </section>

            {/* Testimonials Section */}
            <section>
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Trusted by Thousands</h2>
                    <p className="mt-4 text-lg text-nova-gray">See what our customers are saying about us.</p>
                </div>
                <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard imgSrc="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800" name="Sarah J." role="E-commerce Store Owner">
                        HyperNova is incredibly fast. My package arrived two days ahead of schedule. The tracking was pinpoint accurate. Highly recommended!
                    </TestimonialCard>
                    <TestimonialCard imgSrc="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=800" name="Michael B." role="Manufacturing CEO">
                        The international freight service is a game-changer for my business. Complex customs clearance was handled flawlessly. A truly professional team.
                    </TestimonialCard>
                    <TestimonialCard className="md:col-span-2 lg:col-span-1" imgSrc="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800" name="Elena R." role="Legal Consultant">
                        I use HyperNova for all my important documents. The peace of mind knowing they're secure and tracked every step of the way is priceless.
                    </TestimonialCard>
                </div>
            </section>
        </div>
    );
};

export default HomePage;