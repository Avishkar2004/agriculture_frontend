import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../actions/authContext";

const AdminPanel = () => {
    const { getAuthToken } = useAuth() || {}
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = getAuthToken();
            try {
                const { data } = await axios.get("/admin/users", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUsers(data)
            } catch (error) {
                if (error.message && error.response.status === 403) {
                    console.error("Access Denied: You do not have admin privileges")
                } else {
                    console.error("Error fetching users:", error)
                }
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        const token = getAuthToken();
        await axios.delete(`/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prev) => prev.filter((user) => user.id !== id));
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
