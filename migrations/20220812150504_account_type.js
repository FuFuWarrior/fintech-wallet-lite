/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('account_types', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.decimal('deposit_limit');
    table.decimal('transfer_limit_per_txn');
    table.decimal('withdrawal_limit_per_txn');
    table.decimal('transfer_daily_limit');
    table.decimal('withdrawal_daily_limit');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('account_types')
};
