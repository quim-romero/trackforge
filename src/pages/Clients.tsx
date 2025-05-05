import { useState } from "react";
import { useBusinessStore } from "../store/useBusinessStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { Pencil, Trash2, Plus } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  company: string;
  notes?: string;
};

function ClientModal({
  open,
  onClose,
  initial,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Partial<FormValues> & { id?: string };
  onSubmit: (values: FormValues) => void;
}) {
  const density = useSettingsStore((s) => s.density);
  const pad = density === "compact" ? "p-4" : "p-6";
  const inputPad =
    density === "compact" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";

  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      notes: notes.trim() || "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <form
        onSubmit={submit}
        className={`relative mx-4 w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl ${pad} space-y-4`}
      >
        <h2 className="text-lg font-semibold">
          {initial?.id ? "Edit client" : "New client"}
        </h2>

        <div className="space-y-1">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Name
          </label>
          <input
            className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 ${inputPad}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 ${inputPad}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@company.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Company
            </label>
            <input
              className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 ${inputPad}`}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Notes
          </label>
          <textarea
            className={`w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 ${inputPad} min-h-[88px] resize-y`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes…"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-dark text-sm"
          >
            {initial?.id ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } =
    useBusinessStore() as unknown as {
      clients: Array<{
        id: string;
        name: string;
        email: string;
        company: string;
        notes?: string;
        createdAt: string;
      }>;
      addClient: (
        c: Omit<
          {
            id: string;
            name: string;
            email: string;
            company: string;
            notes?: string;
            createdAt: string;
          },
          "id" | "createdAt"
        >
      ) => void;
      updateClient: (
        id: string,
        patch: Partial<{
          name: string;
          email: string;
          company: string;
          notes?: string;
        }>
      ) => void;
      deleteClient: (id: string) => void;
    };

  const density = useSettingsStore((s) => s.density);
  const gridGap = density === "compact" ? "gap-3" : "gap-6";
  const itemPad = density === "compact" ? "p-2.5" : "p-3.5";
  const headerSz = density === "compact" ? "text-xl" : "text-2xl";
  const statSz = density === "compact" ? "text-xs" : "text-sm";
  const btnPad =
    density === "compact" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<null | {
    id: string;
    name: string;
    email: string;
    company: string;
    notes?: string;
  }>(null);

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };
  const openEdit = (c: any) => {
    setEditing(c);
    setShowModal(true);
  };

  const handleCreate = (v: FormValues) => {
    addClient({
      name: v.name,
      email: v.email,
      company: v.company,
      notes: v.notes ?? "",
    });
  };
  const handleSave = (v: FormValues) => {
    if (!editing) return;
    updateClient(editing.id, {
      name: v.name,
      email: v.email,
      company: v.company,
      notes: v.notes ?? "",
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className={`${headerSz} font-bold`}>Clients</h2>
          <span className={`${statSz} text-gray-500`}>
            {clients.length} total
          </span>
        </div>
        <button
          onClick={openCreate}
          className={`${btnPad} rounded-lg border border-brand text-brand hover:bg-brand/5 transition inline-flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" /> New client
        </button>
      </header>

      {clients.length > 0 ? (
        <section
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ${gridGap}`}
        >
          {clients.map((client) => (
            <article
              key={client.id}
              className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 ${itemPad} hover:border-brand/40 transition`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="inline-block w-1.5 h-4 mt-1.5 rounded-full bg-brand" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {client.name || "—"}
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

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(client)}
                    title="Editar"
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Eliminar “${client.name}”?`))
                        deleteClient(client.id);
                    }}
                    title="Eliminar"
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {client.notes && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {client.notes}
                </p>
              )}
            </article>
          ))}
        </section>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No clients yet. Create your first one!
        </p>
      )}

      <ClientModal
        open={showModal}
        onClose={() => setShowModal(false)}
        initial={editing ?? undefined}
        onSubmit={editing ? handleSave : handleCreate}
      />
    </div>
  );
}
