// Compare normalized official records without treating a fresh access date as a factual change.
export function changedRecords<T extends Record<string, unknown>>(previous: T[], next: T[], key: keyof T) {
  const comparable = (record: T) => {
    const { last_source_checked_at: _checked, ...facts } = record;
    return JSON.stringify(facts);
  };
  return {
    changed: next.filter(record => {
      const prior = previous.find(item => item[key] === record[key]);
      return !prior || comparable(prior) !== comparable(record);
    }).map(record => record[key]),
    removed: previous.filter(record => !next.some(item => item[key] === record[key])).map(record => record[key]),
  };
}
