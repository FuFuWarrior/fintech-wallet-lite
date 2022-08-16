/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('accounts', (table) => {
    table.increments();
    table.integer('account_type_id').unsigned().notNullable().references('id').inTable('account_types');
    table.integer('account_holder').unsigned().notNullable().references('id').inTable('users');
    table.decimal('balance').notNullable();
    table.decimal('total_transfer_daily');
    table.decimal('total_withdrawal_daily');
    table.boolean('bvn_verified');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};
// ! Should balance default to zero if nothing is passed to the balance column
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('accounts');
};
