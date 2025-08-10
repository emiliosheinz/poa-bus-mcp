import { InvalidCursorError } from "./InvalidCursorError";

type PaginatedResult<T = unknown> = {
  data: T[];
  nextCursor?: string;
};

const PAGE_SIZE = 100;

function createCursor(offset: number): string {
  return Buffer.from(JSON.stringify({ offset })).toString("base64");
}

function parseCursor(cursor: string | undefined): number {
  if (!cursor) return 0;
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (typeof parsed.offset !== 'number' || parsed.offset < 0) {
      throw new InvalidCursorError("Invalid cursor format: offset must be a non-negative number");
    }
    return parsed.offset;
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      throw error;
    }
    // Per MCP spec, invalid cursors should result in an error
    throw new InvalidCursorError(`Invalid pagination cursor: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}

/**
 * Paginates array data according to MCP specification
 *
 * @param items - Array of items to paginate
 * @param cursor - Optional Base64-encoded cursor for pagination
 * @param pageSize - Number of items per page (default: 100)
 * @returns Paginated result with items array and optional nextCursor
 */
export function paginateData<T = unknown>(
  items: T[],
  cursor: string | undefined,
  pageSize: number = PAGE_SIZE,
): PaginatedResult<T> {
  const offset = parseCursor(cursor);

  if (offset >= items.length) {
    return {
      data: [],
      nextCursor: undefined,
    };
  }

  const endIndex = Math.min(offset + pageSize, items.length);
  const paginatedData = items.slice(offset, endIndex);
  const hasMore = endIndex < items.length;

  return {
    data: paginatedData,
    nextCursor: hasMore ? createCursor(endIndex) : undefined,
  };
}
