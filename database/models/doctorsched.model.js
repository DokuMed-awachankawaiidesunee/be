const pool = require('db');

class DoctorScheduleModel {
  constructor() {
    this.table = 'doctor_schedules';
    this.idColumn = 'id_schedule';
  }

  async create({ id_schedule, id_doctor, day, times }) {
    const text = `
      INSERT INTO ${this.table}(id_schedule, id_doctor, day, times)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id_schedule, id_doctor, day, times];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findById(id_schedule) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    try {
      const { rows } = await pool.query(text, [id_schedule]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll(filter = {}) {
    let text = `SELECT * FROM ${this.table}`;
    const values = [];
    if (filter.id_doctor) {
      text += ` WHERE id_doctor = $1`;
      values.push(filter.id_doctor);
    }
    text += ` ORDER BY day;`;
    try {
      const { rows } = await pool.query(text, values);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async update(id_schedule, updates) {
    const setClauses = [];
    const values     = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if (['day', 'times', 'id_doctor'].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id_schedule);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(id_schedule);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id_schedule) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(text, [id_schedule]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new DoctorScheduleModel();
