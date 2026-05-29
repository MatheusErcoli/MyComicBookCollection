export function getPaginacao(page?: number, limit?: number) {
  const pageNumber = page && page > 0 ? page : 1;
  const limitNumber = limit && limit > 0 ? limit : 20;

  const offset = (pageNumber - 1) * limitNumber;

  return { limit: limitNumber, offset, page: pageNumber };
}

export function getPaginacaoDados(data: any, page: number, limit: number) {
  const { count: totalItems, rows } = data;

  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    data: rows,
    totalPages,
    currentPage: page,
  };
}