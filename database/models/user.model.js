const pool = require('db');

class UserModel {
  constructor() {
    this.table = 'users';
    this.idColumn = 'iduser';
  }
  
  async findById(iduser) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    const values = [iduser];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async create(userData) {
    const { name, email, password, phone_number, address, province } = userData;

    const text = `
      INSERT INTO ${this.table} (name, email, password, phone_number, address, province)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [name, email, password, phone_number, address, province];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findByEmail(email) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE email = $1
      LIMIT 1;
    `;
    const values = [email];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async update(iduser, updates) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if (['name', 'email', 'password', 'phone_number', 'address', 'province'].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(iduser);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(iduser);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(iduser) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    const values = [iduser];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll(filter = {}) {
    let text = `SELECT * FROM ${this.table}`;
    const values = [];
    const clauses = [];

    if (filter.email) {
    clauses.push(`email = $${values.length + 1}`);
      values.push(filter.email);
    }
    if (filter.phone_number) {
      clauses.push(`phone_number = $${values.length + 1}`);
      values.push(filter.phone_number);
    }

    if (clauses.length) {
      text += ' WHERE ' + clauses.join(' AND ');
    }
    text += ' ORDER BY ' + this.idColumn + ' ASC;';

    try {
      const { rows } = await pool.query(text, values);
      return rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserModel();