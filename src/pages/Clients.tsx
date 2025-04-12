import { useBusinessStore } from "../store/useBusinessStore";
import { useState } from "react";

export default function Clients() {
  const { clients, addClient } = useBusinessStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClient({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      notes: "",
    });

    setName("");
    setEmail("");
    setCompany("");
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <p className="text-sm text-gray-500">{clients.length} total</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg"
      >
        <input
          type="text"
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <button type="submit" className="px-4 py-2 bg-brand text-white rounded">
          Add Client
        </button>
      </form>

      <div className="space-y-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
          >
            <h3 className="font-medium">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.company}</p>
            <p className="text-sm text-gray-400">{client.email}</p>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No clients yet. Add your first one!
        </p>
      )}
    </div>
  );
}
