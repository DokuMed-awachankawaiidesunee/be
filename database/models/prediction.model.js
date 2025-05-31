const pool = require('db');

class PredictionModel {
  constructor() {
    this.table = 'predictions';
    this.idColumn = 'id_prediction';
  }

  async create({ id_prediction, disease_code, min_cost, max_cost, recommended_polyclinic }) {
    const text = `
      INSERT INTO ${this.table}(
        id_prediction,
        disease_code,
        min_cost,
        max_cost,
        recommended_polyclinic
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    const values = [id_prediction, disease_code, min_cost, max_cost, recommended_polyclinic];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findById(id_prediction) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    try {
      const { rows } = await pool.query(text, [id_prediction]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll(filter = {}) {
    let text = `SELECT * FROM ${this.table}`;
    const values = [];
    const clauses = [];

    if (filter.disease_code !== undefined) {
      clauses.push(`disease_code = $${values.length + 1}`);
      values.push(filter.disease_code);
    }
    if (filter.recommended_polyclinic !== undefined) {
      clauses.push(`recommended_polyclinic = $${values.length + 1}`);
      values.push(filter.recommended_polyclinic);
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

  async update(id_prediction, updates) {
    const setClauses = [];
    const values     = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if ([
        'disease_code',
        'min_cost',
        'max_cost',
        'recommended_polyclinic'
      ].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id_prediction);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(id_prediction);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id_prediction) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(text, [id_prediction]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new PredictionModel();
