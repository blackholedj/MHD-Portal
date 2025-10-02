import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import {
  FaUsers,
  FaEnvelope,
  FaCheck,
  FaUserShield,
  FaTrash,
  FaBan,
  FaReply,
  FaUndo,
  FaUser,
} from "react-icons/fa";

// ======================================================================
// Komponenta pro správu uživatelů
// ======================================================================
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) console.error("Error fetching users:", error);
    else setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserStatus = async (userId, newStatus) => {
    await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", userId);
    fetchUsers();
  };

  const updateUserRole = async (userId, newRole) => {
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    fetchUsers();
  };

  const toggleBlockUser = async (user) => {
    const action = user.is_blocked ? "odblokovat" : "zablokovat";
    if (
      window.confirm(`Opravdu chcete ${action} uživatele ${user.full_name}?`)
    ) {
      await supabase
        .from("profiles")
        .update({ is_blocked: !user.is_blocked })
        .eq("id", user.id);
      fetchUsers();
    }
  };

  const deleteUser = async (user) => {
    if (
      window.confirm(
        `OPRAVDU chcete trvale smazat uživatele ${user.full_name}? Tato akce je nevratná!`
      )
    ) {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userId: user.id },
      });

      if (error) {
        alert("Chyba při mazání uživatele: " + error.message);
      } else {
        alert("Uživatel byl úspěšně smazán.");
        fetchUsers();
      }
    }
  };

  if (loading) return <p>Načítám uživatele...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Jméno
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status / Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Akce
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className={user.is_blocked ? "bg-red-50" : ""}>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">
                  {user.full_name}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.status}
                </span>
                <span
                  className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "admin"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
                {user.is_blocked && (
                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Zablokován
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <div>
                  {/* --- ZMĚNY JSOU ZDE --- */}
                  {user.status === 'pending' && <button onClick={() => updateUserStatus(user.id, 'approved')} title="Schválit" className="text-green-600 hover:text-green-900 m-1"><FaCheck size={18} /></button>}
                  {user.status === 'approved' && <button onClick={() => updateUserStatus(user.id, 'pending')} title="Vrátit na neschváleného" className="text-gray-500 hover:text-gray-800 m-1"><FaUndo size={16} /></button>}
                  
                  {user.role === 'user' && <button onClick={() => updateUserRole(user.id, 'admin')} title="Povýšit na admina" className="text-blue-600 hover:text-blue-900 m-1"><FaUserShield size={18} /></button>}
                  {user.role === 'admin' && <button onClick={() => updateUserRole(user.id, 'user')} title="Odebrat roli admina" className="text-purple-600 hover:text-purple-900 m-1"><FaUser size={16} /></button>}
                  <button
                    onClick={() => toggleBlockUser(user)}
                    title={user.is_blocked ? "Odblokovat" : "Zablokovat"}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    <FaBan size={18} />
                  </button>
                  {/* <button
                    onClick={() => deleteUser(user)}
                    title="Smazat uživatele"
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash size={18} />
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ======================================================================
// Komponenta pro správu zpráv z kontaktního formuláře
// ======================================================================
const MessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching messages:", error);
    else setMessages(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const deleteMessage = async (messageId) => {
    if (window.confirm("Opravdu chcete smazat tuto zprávu?")) {
      await supabase.from("contacts").delete().eq("id", messageId);
      fetchMessages();
    }
  };

  // Odpověď přes výchozí emailový klient
  const replyToMessage = (email) => {
    window.location.href = `mailto:${email}?subject=Odpověď na Váš dotaz z MHD Portálu`;
  };

  if (loading) return <p>Načítám zprávy...</p>;

  return (
    <div className="space-y-4">
      {messages.length === 0 && <p>Žádné nové zprávy.</p>}
      {messages.map((msg) => (
        <div key={msg.id} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold">
                {msg.name}{" "}
                <span className="font-normal text-gray-500">
                  &lt;{msg.email}&gt;
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(msg.created_at).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => replyToMessage(msg.email)}
                title="Odpovědět"
                className="text-green-600 hover:text-green-900"
              >
                <FaReply size={18} />
              </button>
              <button
                onClick={() => deleteMessage(msg.id)}
                title="Smazat zprávu"
                className="text-red-600 hover:text-red-900"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-gray-700">{msg.message}</p>
        </div>
      ))}
    </div>
  );
};

// ======================================================================
// Hlavní Dashboard komponenta
// ======================================================================
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "messages":
        return <MessageManagement />;
      default:
        return null;
    }
  };

  const TabButton = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-3 font-semibold rounded-t-lg transition-colors duration-200 ${
        activeTab === tabName
          ? "bg-white text-blue-600 border-b-2 border-blue-600"
          : "bg-transparent text-gray-500 hover:bg-gray-100"
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Administrátorský Dashboard</h1>

      {/* Přepínání karet (Tabs) */}
      <div className="flex border-b border-gray-200 mb-6">
        <TabButton tabName="users" label="Uživatelé" icon={<FaUsers />} />
        <TabButton tabName="messages" label="Zprávy" icon={<FaEnvelope />} />
      </div>

      {/* Obsah aktivní karty */}
      <div className="bg-white p-6 rounded-lg shadow-lg">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
