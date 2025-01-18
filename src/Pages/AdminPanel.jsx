import React, { useEffect, useState } from "react";
import { useAuth } from "../actions/authContext";

const AdminPanel = () => {
    const { getAuthToken } = useAuth() || {};
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = getAuthToken();
            try {
                const response = await fetch("/admin/users", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        setError("Access Denied: You do not have admin privileges.");
                    } else {
                        setError("Error fetching users.");
                    }
                    return;
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError("Error fetching users.");
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [getAuthToken]);

    const deleteUser = async (id) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Error deleting user:", response.statusText);
                return;
            }

            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>

                {error && <div className="text-red-600 mb-4">{error}</div>}

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-left">ID</th>
                                <th className="py-2 px-4 border-b text-left">Username</th>
                                <th className="py-2 px-4 border-b text-left">Email</th>
                                <th className="py-2 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{user.id}</td>
                                    <td className="py-2 px-4 border-b">{user.username}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
