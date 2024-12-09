import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { GripVertical, Minus } from "lucide-react";

interface Tanda {
  id: number;
  title: string;
  comments?: string;
  visibility?: "private" | "public" | "shared";
}

interface SelectedTandasListProps {
  tandas: Tanda[];
  onRemoveTanda: (id: number) => void;
  onReorder: (result: any) => void;
}

const SelectedTandasList = ({
  tandas,
  onRemoveTanda,
  onReorder,
}: SelectedTandasListProps) => {
  return (
    <div className="bg-tango-gray rounded-lg p-6">
      <h3 className="text-xl font-semibold text-tango-light mb-4">Selected Tandas</h3>
      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId="tandas">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {tandas.map((tanda, index) => (
                <Draggable
                  key={tanda.id}
                  draggableId={tanda.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center bg-tango-darkGray p-3 rounded-md group hover:bg-tango-darkGray/80"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="h-4 w-4 text-tango-light" />
                      </div>
                      <div className="flex-1 ml-2">
                        <div className="text-tango-light font-medium">{tanda.title}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveTanda(tanda.id)}
                        className="text-tango-light hover:text-tango-red"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SelectedTandasList;