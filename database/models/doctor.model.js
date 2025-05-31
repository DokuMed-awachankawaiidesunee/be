const pool = require('db');

class DoctorModel {
  constructor() {
    this.table = 'doctors';
    this.idColumn = 'id_doctor';
  }

  async create({ id_doctor, id_hospital, name, polyclinic }) {
    const text = `
      INSERT INTO ${this.table}(id_doctor, id_hospital, name, polyclinic)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id_doctor, id_hospital, name, polyclinic];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findById(id_doctor) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    try {
      const { rows } = await pool.query(text, [id_doctor]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll(filter = {}) {
    let text = `SELECT * FROM ${this.table}`;
    const values = [];
    const clauses = [];
    if (filter.id_hospital) {
      clauses.push(`id_hospital = $${values.length + 1}`);
      values.push(filter.id_hospital);
    }
    if (filter.polyclinic) {
      clauses.push(`polyclinic = $${values.length + 1}`);
      values.push(filter.polyclinic);
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

  async update(id_doctor, updates) {
    const setClauses = [];
    const values     = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if (['name', 'polyclinic', 'id_hospital'].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id_doctor);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(id_doctor);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }


  async delete(id_doctor) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(text, [id_doctor]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new DoctorModel();
