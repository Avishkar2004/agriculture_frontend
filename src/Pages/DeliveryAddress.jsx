import React, { useState } from 'react';
import DeliveryAddresses from './DeliveryAddresses';


const DeliveryAddress = () => {
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
                credentials: "include" //Includes credentials (Cookies on the request)
            })
            if (response.ok) {
                const data = await response.json();
                console.log("Address saved successfully", data);
                setIsFormVisible(false);
                setSelectedAddress(address); // Update selected address on save
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

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <DeliveryAddresses />
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
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
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
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
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
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
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Locality</label>
                            <input
                                type="text"
                                name="locality"
                                value={address.locality}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Street Address */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address (Street and Area)</label>
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
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">City/District/Town</label>
                            <input
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* State */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
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
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (optional)</label>
                            <input
                                type="text"
                                name="landmark"
                                value={address.landmark}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Alternate Phone Number */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone Number (optional)</label>
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
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                            <div className="flex justify-between">
                                <label className="inline-flex items-center w-1/2 ">
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
                                <label className="inline-flex items-center w-1/2">
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

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Save and Deliver Here
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-300 text-black py-3 px-6 rounded-lg hover:bg-gray-400 focus:outline-none"
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
