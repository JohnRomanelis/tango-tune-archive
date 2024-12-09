import { Globe, Users, User, Trash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getTandaMetadata } from "@/utils/tandaUtils";

interface TandaSong {
  song: {
    id: number;
    title: string;
    orchestra?: {
      name: string;
    };
    recording_year?: number;
    type?: string;
    style?: string;
    song_singer?: Array<{ singer: { name: string } }>;
  };
}

interface Tanda {
  id: number;
  title: string;
  comments?: string;
  visibility?: 'public' | 'private' | 'shared';
  user_id?: string;
  tanda_song?: TandaSong[];
}

interface TandaCardProps {
  tanda: Tanda;
  currentUserId?: string | null;
  onDelete: (id: number) => void;
}

const TandaCard = ({ tanda, currentUserId, onDelete }: TandaCardProps) => {
  if (!tanda || !tanda.id) return null;
  
  const metadata = getTandaMetadata(tanda);
  const isOwner = currentUserId === tanda.user_id;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="bg-tango-gray rounded-lg p-4 cursor-pointer hover:bg-tango-gray/90 relative group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-tango-light">{tanda.title || 'Untitled Tanda'}</h3>
            <div className="flex items-center space-x-2">
              {tanda.visibility === 'public' && <Globe className="h-4 w-4 text-tango-light" />}
              {tanda.visibility === 'shared' && <Users className="h-4 w-4 text-tango-light" />}
              {isOwner && <User className="h-4 w-4 text-tango-light" />}
            </div>
          </div>
          <div className="text-sm text-tango-light/80 space-y-1">
            <p>{metadata.songCount} songs</p>
            <p>Orchestras: {metadata.orchestras.join(', ') || 'None'}</p>
            <p>Types: {metadata.types.join(', ') || 'None'}</p>
            <p>Styles: {metadata.styles.join(', ') || 'None'}</p>
            <p>Years: {metadata.yearRange}</p>
          </div>
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(tanda.id);
              }}
              className="absolute bottom-2 right-2 text-tango-red opacity-0 group-hover:opacity-100 transition-opacity hover:text-tango-red/80"
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] bg-tango-darkGray border-tango-gray">
        <SheetHeader>
          <SheetTitle className="text-tango-light">{tanda.title || 'Untitled Tanda'}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 text-tango-light">
          {tanda.comments && <p className="text-sm text-tango-light/80">{tanda.comments}</p>}
          <div className="space-y-4">
            {(tanda.tanda_song || []).map((ts, index) => {
              if (!ts?.song) return null;
              const singers = ts.song.song_singer?.map(s => s.singer.name).join(', ');
              return (
                <div key={ts.song.id} className="bg-tango-gray p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{ts.song.title || 'Untitled Song'}</p>
                      <p className="text-sm text-tango-light/80">
                        {ts.song.orchestra?.name || 'Unknown Orchestra'} ({ts.song.recording_year || 'Year unknown'})
                      </p>
                      <p className="text-sm text-tango-light/80">
                        {singers ? `Singers: ${singers}` : 'Instrumental'}
                      </p>
                      <p className="text-sm text-tango-light/80">
                        {ts.song.type || 'Unknown type'} - {ts.song.style || 'Unknown style'}
                      </p>
                    </div>
                    <span className="text-sm text-tango-light/60">#{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TandaCard;