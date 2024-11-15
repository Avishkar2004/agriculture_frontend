import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';

const DeliveryAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [highlightedAddress, setHighlightedAddress] = useState(null);
    const [showAll, setShowAll] = useState(false)

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
        setHighlightedAddress(addressId);
    };

    const handleShowAllToggle = () => {
        setShowAll((prevShowAll) => !prevShowAll)
    }

    return (
        <div className="rounded-lg">
            <div className="space-y-4">
                {addresses.length > 0 ? (
                    (showAll ? addresses : addresses.slice(0, 1)).map((address) => (
                        <div
                            key={address.id}
                            className={`relative text-sm bg-white rounded-lg border p-5 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 ${highlightedAddress === address.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                                }`}
                            onClick={() => {
                                handleSelectAddress(address.id);
                                toggleAccordion(address.id);
                            }}
                        >
                            {highlightedAddress === address.id && (
                                <div className="absolute top-3 right-3 text-blue-600">
                                    <FaCheckCircle size={20} />
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <div className="text-gray-800 font-medium">
                                    {address.city}, {address.street_address}, {address.state} - {address.pincode}
                                </div>
                                <div className="text-gray-500">
                                    {selectedAddress === address.id ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                                </div>
                            </div>
                            {selectedAddress === address.id && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Phone:</span> {address.phone_number}
                                    </p> <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Name:</span> {address.name}
                                    </p>
                                </div>
                            )}
                            {highlightedAddress === address.id && (
                                <button
                                    onClick={() => {
                                        handleSelectAddress(address.id);
                                    }}
                                    className="rounded-full mt-3 bg-blue-600 py-2 px-6 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-xl active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                >
                                    DELIVER HERE
                                </button>
                            )}

                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No saved addresses found.</p>
                )}
            </div>
            {/* Show more button to toggle all addresses */}
            {
                addresses.length > 1 && (
                    <div className='mt-4 flex justify-center'>
                        <button onClick={handleShowAllToggle} className='text-blue-600 hover:underline focus:outline-none'>{showAll ? "Show Less" : "Show More Addresses"}</button>
                    </div>
                )
            }
        </div >
    );
};

export default DeliveryAddresses;
