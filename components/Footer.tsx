
import React from 'react';
import { Link } from 'react-router-dom';

const SocialIcon: React.FC<{ href: string, path: string }> = ({ href, path }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-nova-gray hover:text-nova-gold transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={path} />
        </svg>
    </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-nova-dark-200/30 border-t border-nova-dark-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About */}
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold text-nova-light mb-4">HyperNova Express</h3>
                    <p className="text-nova-gray text-sm">Delivering your future, today. Our commitment is to provide fast, reliable, and secure delivery services across the globe.</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold text-nova-light tracking-wider uppercase mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="text-nova-gray hover:text-nova-light transition-colors">Home</Link></li>
                        <li><Link to="/track" className="text-nova-gray hover:text-nova-light transition-colors">Track a Package</Link></li>
                        <li><Link to="/book" className="text-nova-gray hover:text-nova-light transition-colors">Book a Shipment</Link></li>
                        <li><Link to="/login" className="text-nova-gray hover:text-nova-light transition-colors">Customer Login</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h3 className="font-semibold text-nova-light tracking-wider uppercase mb-4">Our Services</h3>
                    <ul className="space-y-2">
                        <li className="text-nova-gray">Express Domestic</li>
                        <li className="text-nova-gray">International Freight</li>
                        <li className="text-nova-gray">Warehousing</li>
                        <li className="text-nova-gray">Supply Chain Solutions</li>
                    </ul>
                </div>
                
                {/* Contact */}
                <div>
                     <h3 className="font-semibold text-nova-light tracking-wider uppercase mb-4">Contact Us</h3>
                     <ul className="space-y-2 text-nova-gray">
                        <li>123 Nova Way, Orbit City</li>
                        <li>Email: support@hypernova.express</li>
                        <li>Phone: (555) 123-4567</li>
                     </ul>
                </div>
            </div>

            <div className="mt-8 border-t border-nova-gray/20 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-nova-gray">&copy; {new Date().getFullYear()} HyperNova Express Delivery Company. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <SocialIcon href="#" path="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.28C8.28,9.09 5.11,7.38 2.9,4.79C2.53,5.42 2.33,6.16 2.33,6.94C2.33,8.43 3.1,9.75 4.18,10.53C3.47,10.51 2.82,10.31 2.26,10V10.04C2.26,12.08 3.68,13.79 5.6,14.22C5.25,14.31 4.88,14.35 4.5,14.35C4.21,14.35 3.93,14.32 3.66,14.28C4.19,15.93 5.77,17.08 7.63,17.11C6.22,18.21 4.48,18.87 2.61,18.87C2.27,18.87 1.94,18.85 1.61,18.81C3.48,20.07 5.74,20.81 8.16,20.81C16,20.81 20.34,14.23 20.34,8.8C20.34,8.61 20.33,8.42 20.32,8.23C21.18,7.63 21.89,6.87 22.46,6Z" />
                    <SocialIcon href="#" path="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.79 14.26,15 12,15C9.74,15 7.07,15.79 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6Z" />
                    <SocialIcon href="#" path="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M6.5,18.5H9.5V12.5H6.5V18.5M8,11.2A1.2,1.2 0 1,1 9.2,10A1.2,1.2 0 0,1 8,11.2M18.5,18.5H15.5V14.8C15.5,13.5 15.1,12.5 13.6,12.5C12.1,12.5 11.5,13.5 11.5,14.8V18.5H8.5V12.5H11.5V13.8H11.5C12.1,12.8 13.1,12.2 14.5,12.2C16.9,12.2 18.5,13.9 18.5,16.5V18.5Z" />
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
