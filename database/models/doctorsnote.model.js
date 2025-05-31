const pool = require('db');

class DoctorsNoteModel {
  constructor() {
    this.table = 'doctors_notes';
    this.idColumn = 'id_note';
  }

  async create({ id_note, diagnosis, prescribed_med, prediction_id, follow_up_date = null }) {
    const text = `
      INSERT INTO ${this.table}(id_note, diagnosis, prescribed_med, prediction_id, follow_up_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [id_note, diagnosis, prescribed_med, prediction_id, follow_up_date];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findById(id_note) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    try {
      const { rows } = await pool.query(text, [id_note]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll(filter = {}) {
    let text = `SELECT * FROM ${this.table}`;
    const values = [];
    if (filter.prediction_id) {
      text += ` WHERE prediction_id = $1`;
      values.push(filter.prediction_id);
    }
    text += ` ORDER BY created_at DESC;`;

    try {
      const { rows } = await pool.query(text, values);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async update(id_note, updates) {
    const setClauses = [];
    const values     = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if (['diagnosis', 'prescribed_med', 'follow_up_date'].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id_note);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(id_note);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id_note) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(text, [id_note]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new DoctorsNoteModel();