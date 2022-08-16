/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('account_types').del()
  await knex('account_types').insert([
    {
      id: 1, 
      name: 'tier 1', 
      deposit_limit: null, 
      transfer_limit_per_txn: 10000,
      withdrawal_limit_per_txn: 10000,
      transfer_daily_limit: 50000,
      withdrawal_daily_limit: 5000 
  },
    {
      id: 2, 
      name: 'tier 2',
      deposit_limit: null, 
      transfer_limit_per_txn: 30000,
      withdrawal_limit_per_txn: 30000 ,
      transfer_daily_limit: 100000,
      withdrawal_daily_limit: 100000,
    },
    {
      id: 3, 
      name: 'tier 3',
      deposit_limit: null, 
      transfer_limit_per_txn: 50000,
      withdrawal_limit_per_txn: 50000,
      transfer_daily_limit: 500000,
      withdrawal_daily_limit: 500000
    }
  ]);
};
