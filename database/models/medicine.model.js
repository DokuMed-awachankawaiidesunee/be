const pool = require('db');

class MedicineModel {
  constructor() {
    this.table = 'medicine';
    this.idColumn = 'id_medicine';
  }

  async create({
    id_medicine,
    kfa_code,
    name,
    active_ingredients = null,
    price,
    description = null,
    indication = null,
    warning = null,
    side_effect = null
  }) {
    const text = `
      INSERT INTO ${this.table}(
        id_medicine,
        kfa_code,
        name,
        active_ingredients,
        price,
        description,
        indication,
        warning,
        side_effect
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;
    const values = [
      id_medicine,
      kfa_code,
      name,
      active_ingredients,
      price,
      description,
      indication,
      warning,
      side_effect
    ];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findById(id_medicine) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.idColumn} = $1
      LIMIT 1;
    `;
    try {
      const { rows } = await pool.query(text, [id_medicine]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    const text = `
      SELECT *
      FROM ${this.table}
      ORDER BY name;
    `;
    try {
      const { rows } = await pool.query(text);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async update(id_medicine, updates = {}) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    const allowed = [
      'kfa_code',
      'name',
      'active_ingredients',
      'price',
      'description',
      'indication',
      'warning',
      'side_effect'
    ];

    for (const [column, value] of Object.entries(updates)) {
      if (allowed.includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id_medicine);
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.idColumn} = $${idx}
      RETURNING *;
    `;
    values.push(id_medicine);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id_medicine) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.idColumn} = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(text, [id_medicine]);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new MedicineModel();
