export interface SearchParams {
  orchestra?: string;
  singer?: string;
  yearFrom?: number;
  yearTo?: number;
  isInstrumental?: boolean;
  type?: string;
  style?: string;
  includeMine?: boolean;
  includeShared?: boolean;
  includePublic?: boolean;
  includeLiked?: boolean;
}