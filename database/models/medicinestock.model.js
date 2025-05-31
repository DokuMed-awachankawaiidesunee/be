const pool = require('db');

class MedicineStockModel {
  constructor() {
    this.table = 'medicine_stocks';
    this.pk1 = 'id_hospital';
    this.pk2 = 'id_medicine';
    this.pk3 = 'input_year';
    this.pk4 = 'input_month';
  }

  async create({
    id_hospital,
    id_medicine,
    input_year,
    input_month,
    min_stock,
    max_stock,
    current_stock,
    usage_qty,
    order_qty,
    order_date,
    lead_time
  }) {
    const text = `
      INSERT INTO ${this.table}(
        id_hospital,
        id_medicine,
        input_year,
        input_month,
        min_stock,
        max_stock,
        current_stock,
        usage_qty,
        order_qty,
        order_date,
        lead_time
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `;
    const values = [
      id_hospital,
      id_medicine,
      input_year,
      input_month,
      min_stock,
      max_stock,
      current_stock,
      usage_qty,
      order_qty,
      order_date,
      lead_time
    ];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async findByCompositeKey(id_hospital, id_medicine, input_year, input_month) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${this.pk1} = $1
        AND ${this.pk2} = $2
        AND ${this.pk3} = $3
        AND ${this.pk4} = $4
      LIMIT 1;
    `;
    const values = [id_hospital, id_medicine, input_year, input_month];

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

    if (filter.id_hospital) {
      clauses.push(`id_hospital = $${values.length + 1}`);
      values.push(filter.id_hospital);
    }
    if (filter.id_medicine) {
      clauses.push(`id_medicine = $${values.length + 1}`);
      values.push(filter.id_medicine);
    }
    if (filter.input_year) {
      clauses.push(`input_year = $${values.length + 1}`);
      values.push(filter.input_year);
    }
    if (filter.input_month) {
      clauses.push(`input_month = $${values.length + 1}`);
      values.push(filter.input_month);
    }

    if (clauses.length) text += ' WHERE ' + clauses.join(' AND ');
    text += ' ORDER BY input_year DESC, input_month DESC;';

    try {
      const { rows } = await pool.query(text, values);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async update(
    { id_hospital, id_medicine, input_year, input_month },
    updates
  ) {
    const setClauses = [];
    const values     = [];
    let idx = 1;

    for (const [column, value] of Object.entries(updates)) {
      if ([
        'min_stock',
        'max_stock',
        'current_stock',
        'usage_qty',
        'order_qty',
        'order_date',
        'lead_time'
      ].includes(column)) {
        setClauses.push(`${column} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      return this.findByCompositeKey(
        id_hospital,
        id_medicine,
        input_year,
        input_month
      );
    }

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE ${this.pk1} = $${idx}
        AND ${this.pk2} = $${idx + 1}
        AND ${this.pk3} = $${idx + 2}
        AND ${this.pk4} = $${idx + 3}
      RETURNING *;
    `;
    values.push(id_hospital, id_medicine, input_year, input_month);

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id_hospital, id_medicine, input_year, input_month) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${this.pk1} = $1
        AND ${this.pk2} = $2
        AND ${this.pk3} = $3
        AND ${this.pk4} = $4
      RETURNING *;
    `;
    const values = [id_hospital, id_medicine, input_year, input_month];

    try {
      const { rows } = await pool.query(text, values);
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new MedicineStockModel();