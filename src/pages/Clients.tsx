import { useBusinessStore } from "../store/useBusinessStore";

export default function Clients() {
  const { clients, addClient } = useBusinessStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Clients</h2>
      {/* Client list + form */}
    </div>
  );
}
