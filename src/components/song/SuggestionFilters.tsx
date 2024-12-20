import { Toggle } from "@/components/ui/toggle";

interface SuggestionFiltersProps {
  showPending: boolean;
  showApproved: boolean;
  showRejected: boolean;
  setShowPending: (show: boolean) => void;
  setShowApproved: (show: boolean) => void;
  setShowRejected: (show: boolean) => void;
}

const SuggestionFilters = ({
  showPending,
  showApproved,
  showRejected,
  setShowPending,
  setShowApproved,
  setShowRejected,
}: SuggestionFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Toggle
        pressed={showPending}
        onPressedChange={setShowPending}
        className="data-[state=on]:bg-yellow-600"
      >
        Pending
      </Toggle>
      <Toggle
        pressed={showApproved}
        onPressedChange={setShowApproved}
        className="data-[state=on]:bg-green-600"
      >
        Approved
      </Toggle>
      <Toggle
        pressed={showRejected}
        onPressedChange={setShowRejected}
        className="data-[state=on]:bg-red-600"
      >
        Rejected
      </Toggle>
    </div>
  );
};

export default SuggestionFilters;