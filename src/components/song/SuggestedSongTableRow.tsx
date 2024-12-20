import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SongSuggestion } from "@/types/song";

interface SuggestedSongTableRowProps {
  suggestion: SongSuggestion;
  isSelected: boolean;
  onSongClick: () => void;
  actions: React.ReactNode;
}

const SuggestedSongTableRow = ({
  suggestion,
  isSelected,
  onSongClick,
  actions,
}: SuggestedSongTableRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "approved":
      case "approved-edited":
        return "bg-green-500/20 text-green-500";
      case "rejected":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const singerNames = suggestion.suggested_song_singer && suggestion.suggested_song_singer.length > 0
    ? suggestion.suggested_song_singer.map(s => s.singer.name).join(", ")
    : suggestion.is_instrumental ? "Instrumental" : "-";

  return (
    <TableRow
      className={`cursor-pointer hover:bg-tango-darkGray/50 ${
        isSelected ? "bg-tango-darkGray" : ""
      }`}
      onClick={onSongClick}
    >
      <TableCell className="text-tango-light font-medium">
        {suggestion.title}
      </TableCell>
      <TableCell className="text-tango-light">
        {suggestion.orchestra?.name}
      </TableCell>
      <TableCell className="text-tango-light">
        {singerNames}
      </TableCell>
      <TableCell className="text-tango-light">{suggestion.type}</TableCell>
      <TableCell className="text-tango-light">{suggestion.style}</TableCell>
      <TableCell className="text-tango-light">
        {suggestion.recording_year}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`${getStatusColor(suggestion.status)} border-none`}
        >
          {suggestion.status}
        </Badge>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        {actions}
      </TableCell>
    </TableRow>
  );
};

export default SuggestedSongTableRow;