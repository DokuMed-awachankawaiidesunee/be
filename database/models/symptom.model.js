const pool = require('db');

class SymptomModel {
  constructor() {
    this.table = 'symptoms';
    this.idColumn = 'id_symptom';
  }

  async create({ id_symptom, symptoms_code, how_long, severity }) {
    const text = `
      INSERT INTO ${this.table}(id_symptom, symptoms_code, how_long, severity)
      VALUES($1,$2,$3,$4)
      RETURNING *;
    `;
    const values = [id_symptom, symptoms_code, how_long, severity];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findById(id_symptom) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    try {
      const { rows } = await pool.query(text, [id_symptom]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll(filter = {}) {
    let text = `SELECT * FROM ${this.table}`;
    const values = [];
    const clauses = [];

    if (filter.symptoms_code !== undefined) {
      clauses.push(`symptoms_code = $${values.length + 1}`);
      values.push(filter.symptoms_code);
    }
    if (filter.how_long !== undefined) {
      clauses.push(`how_long = $${values.length + 1}`);
      values.push(filter.how_long);
    }
    if (filter.severity !== undefined) {
      clauses.push(`severity = $${values.length + 1}`);
      values.push(filter.severity);
    }

    if (clauses.length) text += ' WHERE ' + clauses.join(' AND ');
    text += ' ORDER BY created_at DESC;';

    try {
      const { rows } = await pool.query(text, values);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async update(id_symptom, updates) {
    const setClauses = [];
    const values     = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if (['symptoms_code', 'how_long', 'severity'].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id_symptom);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(id_symptom);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id_symptom) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(text, [id_symptom]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new SymptomModel();
