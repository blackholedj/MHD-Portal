import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Logika pro načtení všech uživatelů z tabulky 'profiles'
    const { data } = await supabase.from("profiles").select("*");
    if (data) setUsers(data);
  };

  const updateUserStatus = async (userId, newStatus) => {
    // Logika pro update statusu uživatele (pending -> approved)
    await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", userId);
    fetchUsers(); // Znovu načíst uživatele
  };

  const updateUserRole = async (userId, newRole) => {
    // Logika pro update role uživatele (user -> admin)
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Administrátorský Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Správa uživatelů</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Jméno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.full_name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.status}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 space-x-2">
                    {user.status === "pending" && (
                      <button
                        onClick={() => updateUserStatus(user.id, "approved")}
                        className="text-green-600 hover:text-green-900"
                      >
                        Schválit
                      </button>
                    )}
                    {user.role === "user" && (
                      <button
                        onClick={() => updateUserRole(user.id, "admin")}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Povýšit na admina
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zde přijdou další sekce: Správa dokumentů, Správa kurzů, Zprávy z kontaktu */}
    </div>
  );
};

export default Dashboard;
