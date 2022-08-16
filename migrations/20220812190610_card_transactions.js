/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('card_transactions', (table) => {
        table.increments()
        table.decimal( 'amount', 20, 4).notNullable()
        table.string('external_reference').unique()
        table.integer('account_id').unsigned().notNullable().references('id').inTable('accounts');
        table.string('last_response').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('card_transactions')
};
