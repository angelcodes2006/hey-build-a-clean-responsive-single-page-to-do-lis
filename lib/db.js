const STORAGE_KEY = "sprout_db";

// Inline seed data (mirrors db/seed.json)
const SEED_DATA = {
  tasks: [
    { id: "t1", title: "Buy groceries", completed: false, dueDate: "2026-10-01", createdAt: "2026-09-20" },
    { id: "t2", title: "Finish project report", completed: false, dueDate: "2026-09-30", createdAt: "2026-09-18" },
    { id: "t3", title: "Call Mom", completed: true, dueDate: null, createdAt: "2026-09-15" },
    { id: "t4", title: "Schedule dentist appointment", completed: false, dueDate: "2026-10-10", createdAt: "2026-09-10" },
    { id: "t5", title: "Read a chapter of a book", completed: true, dueDate: null, createdAt: "2026-09-12" },
    { id: "t6", title: "Workout - 30 mins", completed: false, dueDate: "2026-09-28", createdAt: "2026-09-14" },
    { id: "t7", title: "Plan weekend trip", completed: false, dueDate: "2026-10-05", createdAt: "2026-09-19" },
    { id: "t8", title: "Pay electricity bill", completed: true, dueDate: null, createdAt: "2026-09-08" },
    { id: "t9", title: "Update resume", completed: false, dueDate: "2026-10-02", createdAt: "2026-09-22" },
    { id: "t10", title: "Water the plants", completed: false, dueDate: "2026-09-27", createdAt: "2026-09-21" }
  ]
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : deepClone(SEED_DATA);
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

let _db = loadDb();

function getAll(table) {
  const records = _db[table] ?? [];
  return deepClone(records);
}

function getById(table, id) {
  const records = _db[table] ?? [];
  const found = records.find(r => r.id === id);
  return found ? deepClone(found) : null;
}

function insert(table, record) {
  const newRecord = { ...record };
  if (!newRecord.id) {
    newRecord.id = "id_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
  }
  if (!(_db[table] instanceof Array)) {
    _db[table] = [];
  }
  _db[table].push(newRecord);
  saveDb(_db);
  return deepClone(newRecord);
}

function update(table, id, patch) {
  const records = _db[table] ?? [];
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return null;
  const updated = { ...records[idx], ...patch, id };
  records[idx] = updated;
  saveDb(_db);
  return deepClone(updated);
}

function remove(table, id) {
  const records = _db[table] ?? [];
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return false;
  records.splice(idx, 1);
  saveDb(_db);
  return true;
}

function reset() {
  _db = deepClone(SEED_DATA);
  saveDb(_db);
}

export { getAll, getById, insert, update, remove, reset };