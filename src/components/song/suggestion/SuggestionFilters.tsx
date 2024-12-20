import { Toggle } from "@/components/ui/toggle";

interface SuggestionFiltersProps {
  showPending: boolean;
  showApproved: boolean;
  showRejected: boolean;
  onShowPendingChange: (value: boolean) => void;
  onShowApprovedChange: (value: boolean) => void;
  onShowRejectedChange: (value: boolean) => void;
}

const SuggestionFilters = ({
  showPending,
  showApproved,
  showRejected,
  onShowPendingChange,
  onShowApprovedChange,
  onShowRejectedChange,
}: SuggestionFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Toggle
        pressed={showPending}
        onPressedChange={onShowPendingChange}
        className="data-[state=on]:bg-yellow-600"
      >
        Pending
      </Toggle>
      <Toggle
        pressed={showApproved}
        onPressedChange={onShowApprovedChange}
        className="data-[state=on]:bg-green-600"
      >
        Approved
      </Toggle>
      <Toggle
        pressed={showRejected}
        onPressedChange={onShowRejectedChange}
        className="data-[state=on]:bg-red-600"
      >
        Rejected
      </Toggle>
    </div>
  );
};

export default SuggestionFilters;