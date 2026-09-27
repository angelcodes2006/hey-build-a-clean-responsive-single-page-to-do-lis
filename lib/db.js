const STORAGE_KEY = "sprout_db";

const SEED_DATA = {
  "tasks": [
    {
      "id": "task_1",
      "title": "Buy groceries",
      "completed": false,
      "dueDate": "2026-10-01",
      "createdAt": "2026-09-20T09:00:00Z"
    },
    {
      "id": "task_2",
      "title": "Finish project report",
      "completed": false,
      "dueDate": "2026-09-30",
      "createdAt": "2026-09-18T14:30:00Z"
    },
    {
      "id": "task_3",
      "title": "Call Mom",
      "completed": true,
      "dueDate": null,
      "createdAt": "2026-09-15T08:15:00Z"
    },
    {
      "id": "task_4",
      "title": "Schedule dentist appointment",
      "completed": false,
      "dueDate": "2026-10-10",
      "createdAt": "2026-09-10T11:45:00Z"
    },
    {
      "id": "task_5",
      "title": "Read a chapter of a book",
      "completed": true,
      "dueDate": null,
      "createdAt": "2026-09-12T20:00:00Z"
    },
    {
      "id": "task_6",
      "title": "Workout - 30 mins cardio",
      "completed": false,
      "dueDate": "2026-09-28",
      "createdAt": "2026-09-19T07:00:00Z"
    },
    {
      "id": "task_7",
      "title": "Plan weekend trip",
      "completed": false,
      "dueDate": "2026-10-05",
      "createdAt": "2026-09-14T16:20:00Z"
    },
    {
      "id": "task_8",
      "title": "Update resume",
      "completed": true,
      "dueDate": null,
      "createdAt": "2026-09-08T10:10:00Z"
    },
    {
      "id": "task_9",
      "title": "Pay electricity bill",
      "completed": false,
      "dueDate": "2026-09-25",
      "createdAt": "2026-09-13T13:55:00Z"
    },
    {
      "id": "task_10",
      "title": "Organize desk",
      "completed": true,
      "dueDate": null,
      "createdAt": "2026-09-11T09:40:00Z"
    }
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

export function getAll(table) {
  return _db[table] ? deepClone(_db[table]) : [];
}

export function getById(table, id) {
  const records = _db[table] || [];
  return records.find(r => r.id === id) || null;
}

export function insert(table, record) {
  if (!_db[table]) _db[table] = [];
  const copy = deepClone(record);
  _db[table].push(copy);
  saveDb(_db);
  return copy;
}

export function update(table, id, patch) {
  const records = _db[table] || [];
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return null;
  const updated = { ...records[idx], ...patch };
  records[idx] = updated;
  saveDb(_db);
  return updated;
}

export function remove(table, id) {
  const records = _db[table] || [];
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return false;
  records.splice(idx, 1);
  saveDb(_db);
  return true;
}

export function reset() {
  _db = deepClone(SEED_DATA);
  saveDb(_db);
}
