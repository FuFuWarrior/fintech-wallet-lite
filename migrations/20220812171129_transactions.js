/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transactions', (table) => {
        table.increments();
        table.enu('txn_type', ['credit', 'debit']).notNullable();
        table.enu('purpose', ['deposit', 'transfer', 'withdrawal']).notNullable();
        table.decimal('amount', 20, 4).notNullable();
        table.integer('account_id').unsigned().notNullable().references('id').inTable('accounts');
        table.uuid('txn_reference').unique().notNullable();
        table.decimal('balance_before').notNullable();
        table.decimal('balance_after').notNullable();
        table.json('metadata');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('transactions')
};
