import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SuggestedSongTableRow from "./SuggestedSongTableRow";
import { Check, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SongSuggestion } from "@/types/song";

interface SuggestedSongsTableProps {
  suggestions: SongSuggestion[];
  selectedTrackId: string | null;
  onSongClick: (spotify_id: string | null) => void;
  onApprove: (suggestion: SongSuggestion) => void;
  onReject: (id: number) => void;
  onEdit: (suggestion: SongSuggestion) => void;
}

const SuggestedSongsTable = ({
  suggestions,
  selectedTrackId,
  onSongClick,
  onApprove,
  onReject,
  onEdit,
}: SuggestedSongsTableProps) => {
  return (
    <div className="rounded-md bg-tango-gray">
      <Table>
        <TableHeader className="bg-tango-darkGray border-b border-tango-gray/20">
          <TableRow>
            <TableHead className="text-tango-light">Title</TableHead>
            <TableHead className="text-tango-light">Orchestra</TableHead>
            <TableHead className="text-tango-light">Singer</TableHead>
            <TableHead className="text-tango-light">Type</TableHead>
            <TableHead className="text-tango-light">Style</TableHead>
            <TableHead className="text-tango-light">Year</TableHead>
            <TableHead className="text-tango-light">Status</TableHead>
            <TableHead className="text-tango-light w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((suggestion) => (
            <SuggestedSongTableRow
              key={suggestion.id}
              suggestion={suggestion}
              isSelected={suggestion.spotify_id === selectedTrackId}
              onSongClick={() => onSongClick(suggestion.spotify_id)}
              actions={
                <div className="flex gap-2">
                  {suggestion.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                        onClick={() => onApprove(suggestion)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => onReject(suggestion.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                        onClick={() => onEdit(suggestion)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              }
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SuggestedSongsTable;