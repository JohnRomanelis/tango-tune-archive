import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

interface TandaDetailsDialogProps {
  tanda: any;
  isOpen: boolean;
  onClose: () => void;
}

const TandaDetailsDialog = ({ tanda, isOpen, onClose }: TandaDetailsDialogProps) => {
  if (!tanda) return null;

  const getYearRange = () => {
    const years = tanda.tanda_song
      .map((ts: any) => ts.song.recording_year)
      .filter(Boolean);
    if (years.length === 0) return "Unknown";
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? min : `${min} - ${max}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-tango-darkGray border-tango-gray">
        <DialogHeader>
          <DialogTitle className="text-tango-light flex items-center gap-2">
            <Info className="h-5 w-5" />
            {tanda.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 text-tango-light">
            {tanda.comments && (
              <div>
                <h3 className="font-semibold mb-1">Comments</h3>
                <p className="text-tango-light/80">{tanda.comments}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold mb-2">Songs</h3>
              <div className="space-y-3">
                {tanda.tanda_song
                  .sort((a: any, b: any) => a.order_in_tanda - b.order_in_tanda)
                  .map((ts: any) => (
                    <div key={ts.song.id} className="bg-tango-gray p-3 rounded-md">
                      <p className="font-medium">{ts.song.title}</p>
                      <p className="text-sm text-tango-light/80">
                        {ts.song.orchestra?.name} 
                        {ts.song.recording_year && ` (${ts.song.recording_year})`}
                      </p>
                      <p className="text-sm text-tango-light/80">
                        {ts.song.song_singer?.map((s: any) => s.singer.name).join(", ") || "Instrumental"}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">Year Range</h3>
                <p className="text-tango-light/80">{getYearRange()}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Type</h3>
                <p className="text-tango-light/80 capitalize">
                  {tanda.tanda_song[0]?.song.type || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TandaDetailsDialog;