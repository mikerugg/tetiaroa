// Read-only SQL parsing helpers, adapted from the existing Drupal importer.
export function parseNeededTables(dump, tableNames) {
  const parsed = {};

  for (const tableName of tableNames) {
    const columns = getTableColumns(dump, tableName);

    if (!columns.length) {
      parsed[tableName] = [];
      continue;
    }

    parsed[tableName] = parseTableRows(dump, tableName, columns);
  }

  return parsed;
}

function getTableColumns(dump, tableName) {
  const start = dump.indexOf(`CREATE TABLE \`${tableName}\``);

  if (start === -1) {
    return [];
  }

  const end = dump.indexOf("\n) ENGINE=", start);
  const block = dump.slice(start, end === -1 ? start + 5000 : end);

  return block
    .split("\n")
    .flatMap((line) => {
      const match = line.match(/^\s*`([^`]+)`\s+/);
      return match ? [match[1]] : [];
    });
}

function parseTableRows(dump, tableName, columns) {
  const marker = `INSERT INTO \`${tableName}\` VALUES `;
  const rows = [];
  let index = 0;

  while (index < dump.length) {
    const start = dump.indexOf(marker, index);

    if (start === -1) {
      break;
    }

    const valuesStart = start + marker.length;
    const end = dump.indexOf(";\n", valuesStart);
    const values = dump.slice(valuesStart, end === -1 ? dump.length : end);
    parseInsertValues(values, columns, rows);
    index = end === -1 ? dump.length : end + 2;
  }

  return rows;
}

function parseInsertValues(values, columns, rows) {
  let index = 0;

  while (index < values.length) {
    if (values[index] !== "(") {
      index += 1;
      continue;
    }

    index += 1;
    const rowValues = [];

    while (index < values.length && values[index] !== ")") {
      const parsed = parseSqlValue(values, index);
      rowValues.push(parsed.value);
      index = parsed.nextIndex;

      if (values[index] === ",") {
        index += 1;
      }
    }

    if (values[index] === ")") {
      index += 1;
    }

    const row = {};

    for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
      row[columns[columnIndex]] = rowValues[columnIndex] ?? null;
    }

    rows.push(row);
  }
}

function parseSqlValue(input, startIndex) {
  if (input[startIndex] === "'") {
    let index = startIndex + 1;
    let value = "";

    while (index < input.length) {
      const char = input[index];

      if (char === "\\") {
        const next = input[index + 1];
        value += decodeEscape(next);
        index += 2;
        continue;
      }

      if (char === "'") {
        return { value, nextIndex: index + 1 };
      }

      value += char;
      index += 1;
    }

    return { value, nextIndex: index };
  }

  let index = startIndex;

  while (
    index < input.length &&
    input[index] !== "," &&
    input[index] !== ")"
  ) {
    index += 1;
  }

  const rawValue = input.slice(startIndex, index).trim();

  if (rawValue === "NULL") {
    return { value: null, nextIndex: index };
  }

  if (/^-?\d+(?:\.\d+)?$/.test(rawValue)) {
    return { value: Number(rawValue), nextIndex: index };
  }

  return { value: rawValue, nextIndex: index };
}

function decodeEscape(value) {
  switch (value) {
    case "n":
      return "\n";
    case "r":
      return "\r";
    case "t":
      return "\t";
    case "0":
      return "\0";
    case undefined:
      return "";
    default:
      return value;
  }
}

