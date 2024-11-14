import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing icons

const DeliveryAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null); // To track which address is expanded
    const [highlightedAddress, setHighlightedAddress] = useState(null); // To track the selected address

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await fetch("/api/deliveryAddress", {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            } else {
                console.error("Error fetching addresses:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const toggleAccordion = (addressId) => {
        setSelectedAddress((prevSelected) => (prevSelected === addressId ? null : addressId));
    };

    const handleSelectAddress = (addressId) => {
        setHighlightedAddress(addressId); // Highlight the selected address
    };

    return (
        <div className="p-6 rounded-lg bg-white ">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Saved Delivery Addresses</h2>
            <div className="space-y-4">
                {addresses.length > 0 ? (
                    addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`bg-gray-100 rounded-lg relative`}
                        >
                            {/* Circle indicator for selection */}
                            {highlightedAddress === address.id && (
                                <div className="absolute top-0 left-0 -translate-x-3 translate-y-3 rounded-full bg-blue-500 text-white p-2">
                                    <span className="text-xs font-bold">✔</span>
                                </div>
                            )}

                            <div
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => {
                                    toggleAccordion(address.id);
                                    handleSelectAddress(address.id);
                                }}
                            >
                                <div className="text-sm text-gray-800">
                                    {address.city}, {address.street_address}, {address.state} - {address.pincode}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {selectedAddress === address.id ? (
                                        <FaChevronUp size={18} />
                                    ) : (
                                        <FaChevronDown size={18} />
                                    )}
                                </div>
                            </div>
                            {selectedAddress === address.id && (
                                <div className="p-4 bg-white rounded-b-lg border-t border-gray-200">
                                    <p className="text-sm text-gray-600">Phone: <span className="font-semibold text-gray-800">{address.phone_number}</span></p>
                                    <p className="text-sm text-gray-600">Type: <span className="font-semibold text-gray-800">{address.address_type}</span></p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No saved addresses found.</p>
                )}
            </div>
        </div>
    );
};

export default DeliveryAddresses;
