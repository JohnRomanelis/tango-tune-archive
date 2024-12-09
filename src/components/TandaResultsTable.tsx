import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play } from "lucide-react";

interface Song {
  id: number;
  title: string;
  type: string;
  style: string;
  recording_year?: number;
  is_instrumental?: boolean;
  spotify_id?: string;
  orchestra?: { name: string };
  song_singer?: Array<{ singer: { name: string } }>;
}

interface TandaSong {
  order_in_tanda: number;
  song: Song;
}

interface Tanda {
  id: number;
  title: string;
  comments?: string;
  created_at: string;
  tanda_song: TandaSong[];
}

interface TandaResultsTableProps {
  tandas: Tanda[];
}

const TandaResultsTable = ({ tandas = [] }: TandaResultsTableProps) => {
  return (
    <div className="rounded-md bg-tango-gray">
      <Table>
        <TableHeader className="bg-tango-darkGray border-b border-tango-gray/20">
          <TableRow>
            <TableHead className="text-tango-light">Title</TableHead>
            <TableHead className="text-tango-light">Songs</TableHead>
            <TableHead className="text-tango-light">Orchestra</TableHead>
            <TableHead className="text-tango-light">Type</TableHead>
            <TableHead className="text-tango-light">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tandas.map((tanda) => (
            <TableRow
              key={tanda.id}
              className="hover:bg-tango-darkGray/50 cursor-pointer transition-colors rounded-lg group"
            >
              <TableCell className="font-medium text-tango-light">
                {tanda.title}
              </TableCell>
              <TableCell className="text-tango-light">
                {tanda.tanda_song.length} songs
              </TableCell>
              <TableCell className="text-tango-light">
                {tanda.tanda_song[0]?.song.orchestra?.name || 'Unknown'}
              </TableCell>
              <TableCell className="text-tango-light capitalize">
                {tanda.tanda_song[0]?.song.type || '-'}
              </TableCell>
              <TableCell className="text-tango-light">
                {new Date(tanda.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TandaResultsTable;