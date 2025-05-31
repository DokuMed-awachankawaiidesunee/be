const pool = require('db');

class InsuranceModel {
  constructor() {
    this.table = 'insurance';
    this.idColumn = 'id_insurance';
  }

  async create({
    id_insurance,
    insurance_company,
    insurance_type,
    insurance_cost,
    insurance_coverage
  }) {
    const text = `
      INSERT INTO ${this.table}(
        id_insurance,
        insurance_company,
        insurance_type,
        insurance_cost,
        insurance_coverage
      )
      VALUES($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    const values = [
      id_insurance,
      insurance_company,
      insurance_type,
      insurance_cost,
      insurance_coverage
    ];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findById(id_insurance) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    try {
      const { rows } = await pool.query(text, [id_insurance]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    const text = `SELECT * FROM ${this.table} ORDER BY insurance_company;`;
    try {
      const { rows } = await pool.query(text);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async update(id_insurance, updates) {
    const setClauses = [];
    const values     = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if ([
        'insurance_company',
        'insurance_type',
        'insurance_cost',
        'insurance_coverage'
      ].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id_insurance);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(id_insurance);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id_insurance) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(text, [id_insurance]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new InsuranceModel();
