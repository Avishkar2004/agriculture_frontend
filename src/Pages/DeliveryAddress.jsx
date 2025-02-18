import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DeliveryAddress = ({ onAddressSelect }) => {
    const [address, setAddress] = useState({
        name: '',
        phoneNumber: '',
        alternatePhoneNumber: '',
        pincode: '',
        locality: '',
        streetAddress: '',
        city: '',
        state: '',
        landmark: '',
        addressType: 'Home', // default value
    });
    const [isFormVisible, setIsFormVisible] = useState(false); // Controls form visibility
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [highlightedAddress, setHighlightedAddress] = useState(null);
    const [showAll, setShowAll] = useState(false)


    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Update addressType directly if it's a radio button
        if (type === "radio" && name === "addressType") {
            setAddress({ ...address, addressType: value });
        } else {
            setAddress({ ...address, [name]: value });
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch("/api/delivery-address/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(address),
                credentials: "include" // Includes credentials (Cookies on the request)
            });

            if (response.ok) {
                const data = await response.json();

                // Update address list immediately after adding
                setAddresses((prevAddresses) => [...prevAddresses, data]);

                // Highlight and select the newly added address
                setSelectedAddress(data.id);
                setHighlightedAddress(data.id);

                // Send the selected address to parent component
                onAddressSelect(data);

                // Hide form after successful save
                setIsFormVisible(false);

                // Reset form state
                setAddress({
                    name: '',
                    phoneNumber: '',
                    alternatePhoneNumber: '',
                    pincode: '',
                    locality: '',
                    streetAddress: '',
                    city: '',
                    state: '',
                    landmark: '',
                    addressType: 'Home',
                });

            } else {
                console.error("Error saving address:", response.statusText);
            }
        } catch (error) {
            console.error("Error saving address:", error);
        }
    };

    const handleCancel = () => {
        setAddress({
            name: '',
            phoneNumber: '',
            alternatePhoneNumber: '',
            pincode: '',
            locality: '',
            streetAddress: '',
            city: '',
            state: '',
            landmark: '',
            addressType: 'Home',
        });
        setIsFormVisible(false); // Hide form on cancel
    };
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
                // Store the fetched addresses in the cookies
                Cookies.set("userAddresses", JSON.stringify(data), { expires: 7 });
                // Set the first address as selected by default if there are any addresses
                if (data.length > 0) {
                    setSelectedAddress(data[0].id);  // Set the first address as selected
                    setHighlightedAddress(data[0].id); // Set the first address as highlighted
                }
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

    const handleSelectAddress = (address) => {
        setSelectedAddress(address) //store the selected address locally
        setHighlightedAddress(address.id)
        onAddressSelect(address)
    };

    const handleShowAllToggle = () => {
        setShowAll((prevShowAll) => !prevShowAll)
    }


    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="rounded-lg">
                <div className="space-y-4">
                    {addresses.length > 0 ? (
                        (showAll ? addresses : addresses.slice(0, 1)).map((address) => (
                            <div
                                key={address.id}
                                className={`relative text-sm bg-white rounded-lg border p-5 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 ${highlightedAddress === address.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                                onClick={() => {
                                    handleSelectAddress(address);
                                    toggleAccordion(address.id);
                                }}
                            >
                                {highlightedAddress === address.id && (
                                    <div className="absolute top-3 right-3 text-blue-600">
                                        <FaCheckCircle size={20} />
                                    </div>
                                )}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {address.name}
                                        <span className="text-sm text-gray-600 ml-2 bg-gray-200">{address.address_type}</span>
                                    </div>
                                    <div className="text-gray-600">
                                        {selectedAddress === address.id ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="text-gray-800 font-medium mb-4">
                                    <p>{address.city}, {address.street_address}, {address.state} - {address.pincode}</p>
                                </div>
                                {selectedAddress === address.id && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border-t border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Phone:</span> {address.phone_number}
                                        </p>
                                        <p className="text-sm text-gray-600">
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
                {addresses.length > 1 && (
                    <div className="mt-4 flex justify-center">
                        <button onClick={handleShowAllToggle} className="text-blue-600 hover:underline focus:outline-none">
                            {showAll ? "Show Less" : "Show More Addresses"}
                        </button>
                    </div>
                )}
            </div>

            {!isFormVisible ? (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Add More Address
                    </button>
                </div>
            ) : (
                <form>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={address.name}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={address.phoneNumber}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength="10"
                                required
                            />
                        </div>

                        {/* Pincode */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={address.pincode}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Locality */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
                            <input
                                type="text"
                                name="locality"
                                value={address.locality}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Street Address (Full Width) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address (Street and Area)</label>
                            <input
                                type="text"
                                name="streetAddress"
                                value={address.streetAddress}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* City/District/Town */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City/District/Town</label>
                            <input
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* State Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <select
                                name="state"
                                value={address.state}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select State</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Delhi">Delhi</option>
                                {/* Add other states */}
                            </select>
                        </div>

                        {/* Landmark */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (optional)</label>
                            <input
                                type="text"
                                name="landmark"
                                value={address.landmark}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Alternate Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone Number (optional)</label>
                            <input
                                type="text"
                                name="alternatePhoneNumber"
                                value={address.alternatePhoneNumber}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength="10"
                            />
                        </div>

                        {/* Address Type */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                            <div className="flex flex-col sm:flex-row justify-between gap-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="addressType"
                                        value="Home"
                                        checked={address.addressType === 'Home'}
                                        onChange={handleChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Home (All Day Delivery)</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="addressType"
                                        value="Work"
                                        checked={address.addressType === 'Work'}
                                        onChange={handleChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Work (Delivery between 10AM - 5PM)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons (Stack on small screens) */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                        >
                            Save and Deliver Here
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-300 text-black py-3 px-6 rounded-lg hover:bg-gray-400 focus:outline-none w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default DeliveryAddress;
