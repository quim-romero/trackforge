import { useBusinessStore } from "../store/useBusinessStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { useState } from "react";

export default function Clients() {
  const { clients, addClient } = useBusinessStore();
  const density = useSettingsStore((s) => s.density);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const layoutSpacing = density === "compact" ? "space-y-4" : "space-y-6";
  const sectionPad = density === "compact" ? "p-3" : "p-6";
  const inputsPad =
    density === "compact" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";

  const gridGap = density === "compact" ? "gap-3" : "gap-6";
  const itemPad = density === "compact" ? "p-2.5" : "p-3";
  const headerSz = density === "compact" ? "text-xl" : "text-2xl";
  const statSz = density === "compact" ? "text-xs" : "text-sm";

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
    <div className={layoutSpacing}>
      <header className="flex justify-between items-center">
        <h2 className={`${headerSz} font-bold`}>Clients</h2>
        <p className={`${statSz} text-gray-500`}>{clients.length} total</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${sectionPad} ${layoutSpacing}`}
      >
        <input
          type="text"
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${inputsPad}`}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${inputsPad}`}
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${inputsPad}`}
        />

        <button
          type="submit"
          className="px-4 py-2 text-sm bg-brand text-white rounded-lg hover:bg-brand-dark transition"
        >
          Add Client
        </button>
      </form>

      {clients.length > 0 ? (
        <section
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ${gridGap}`}
        >
          {clients.map((client) => (
            <div
              key={client.id}
              className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 ${itemPad} hover:border-brand/40 transition`}
            >
              <div className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-4 mt-1.5 rounded-full bg-brand" />
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {client.company || "—"}
                  </p>
                  {client.email && (
                    <p className="text-sm text-gray-500 truncate">
                      {client.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No clients yet. Add your first one!
        </p>
      )}
    </div>
  );
}
