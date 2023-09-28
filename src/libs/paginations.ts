interface PaginationOptions {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

const paginationOption = (
  pageSize: number,
  pageNumber: number,
  totaldocs: number
): PaginationOptions => ({
  totalDocs: totaldocs,
  limit: pageSize,
  totalPages: Math.ceil(totaldocs / pageSize),
  page: pageNumber,
  pagingCounter: (pageNumber - 1) * pageSize + 1,
  hasPrevPage: !!(pageNumber > 1 && totaldocs),
  hasNextPage: !!(pageSize * pageNumber < totaldocs && totaldocs),
  prevPage: pageNumber > 1 ? pageNumber - 1 : null,
  nextPage: pageSize * pageNumber < totaldocs ? pageNumber + 1 : null,
});

export { paginationOption };
