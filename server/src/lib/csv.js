function escapeCell(value) {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCsv(columns, rows) {
  const header = columns.map((c) => escapeCell(c.header)).join(',')
  const lines = rows.map((row) => columns.map((c) => escapeCell(row[c.key])).join(','))
  return [header, ...lines].join('\n')
}

function sendCsv(res, filename, columns, rows) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(toCsv(columns, rows))
}

/**
 * Small state-machine CSV parser — handles quoted fields, embedded commas,
 * escaped quotes (""), and both \n and \r\n line endings.
 */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\r') {
      // skip; \n (below) closes the row
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const nonEmptyRows = rows.filter((r) => !(r.length === 1 && r[0] === ''))
  const [header, ...dataRows] = nonEmptyRows
  return { header: header || [], rows: dataRows }
}

module.exports = { toCsv, sendCsv, parseCsv }
