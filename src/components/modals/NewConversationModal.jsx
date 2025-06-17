import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/stores/authStore";
import useChatStore from "@/stores/chatStore";
import { fetchRecipients } from "@/api/chat";

export default function NewConversationModal() {
  const token = useAuthStore((state) => state.token);
  const {
    selectedUserId,
    setSelectedUserId,
    openNewConvModal,
    setOpenNewConvModal,
    startConversation,
  } = useChatStore();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["recipients"],
    queryFn: () => fetchRecipients(token),
    enabled: openNewConvModal && !!token,
  });

  if (!openNewConvModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold">Nouvelle conversation</h3>

        {isLoading ? (
          <p className="text-sm text-gray-500">Chargement...</p>
        ) : (
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Choisir un destinataire --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.profile.firstName} {u.profile.lastName}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpenNewConvModal(false)}
            className="text-sm text-gray-600 hover:underline"
          >
            Annuler
          </button>
          <button
            onClick={startConversation}
            disabled={!selectedUserId}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 text-sm"
          >
            Démarrer
          </button>
        </div>
      </div>
    </div>
  );
}
