export const SHAPE_COLUMNS = 13;
export const SHAPE_ROWS = 16;

type RowSpan = {
  row: number;
  span?: [number, number];
  extra?: number[];
};

const rows: RowSpan[] = [
  { row: 0, span: [5, 5] },
  { row: 1, span: [3, 6] },
  { row: 2, span: [2, 10] },
  { row: 3, span: [1, 10] },
  { row: 4, span: [1, 11] },
  { row: 5, span: [1, 12] },
  { row: 6, span: [1, 13] },
  { row: 7, span: [5, 13], extra: [2, 3] },
  { row: 8, span: [6, 12] },
  { row: 9, span: [6, 11] },
  { row: 10, span: [7, 11] },
  { row: 11, span: [6, 11], extra: [13] },
  { row: 12, span: [6, 10], extra: [12, 13] },
  { row: 13, span: [7, 10], extra: [12] },
  { row: 14, span: [7, 9] },
  { row: 15, span: [8, 8] },
];

function buildShape(rows: RowSpan[]): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (const { row, span, extra } of rows) {
    if (span) {
      for (let col = span[0]; col <= span[1]; col++) points.push([col, row]);
    }
    if (extra) {
      for (const col of extra) points.push([col, row]);
    }
  }
  return points;
}

export const africaShapeCells = buildShape(rows);
