import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";

export default function KpiDetailsModal({ open, onClose, title, children }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 text-sm text-gray-800 max-h-[60vh] overflow-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

