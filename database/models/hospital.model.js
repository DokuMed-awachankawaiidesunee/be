const pool = require('../db');

class HospitalModel {
  constructor() {
    this.table = 'hospitals';
    this.idColumn = 'id_hospital';
  }

  async create({ id_hospital, address, phone_num }) {
    const text = `
      INSERT INTO ${this.table}(id_hospital, address, phone_num)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id_hospital, address, phone_num];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findById(id_hospital) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    try {
      const { rows } = await pool.query(text, [id_hospital]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    const text = `
      SELECT *
      FROM ${this.table}
      ORDER BY created_at DESC;
    `;
    try {
      const { rows } = await pool.query(text);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async update(id_hospital, updates) {
    const setClauses = [];
    const values     = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if (['address', 'phone_num'].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id_hospital);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(id_hospital);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id_hospital) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(text, [id_hospital]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new HospitalModel();
