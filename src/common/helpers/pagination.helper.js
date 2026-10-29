const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export const getPagination = (query = {}) => {
  const pageIndex = Math.max(Number(query.pageIndex) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
  const keyword = query.keyword?.trim() || "";

  return { pageIndex, pageSize, keyword, skip: (pageIndex - 1) * pageSize };
};

export const buildPaginationResult = ({ pageIndex, pageSize, keyword }, totalRow, data) => {
  return {
    pageIndex,
    pageSize,
    totalRow,
    totalPage: Math.ceil(totalRow / pageSize),
    keywords: keyword,
    data,
  };
};

