export const parseId = (id: string | undefined): number => {
  if (!id) throw new Error("ID is required");
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) throw new Error("Invalid ID format");
  return parsedId;
};