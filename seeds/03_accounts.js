/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('accounts').del()
    await knex('accounts').insert([
        {
          id: 1,
          account_type_id: 3,
          account_holder: 1,
          balance: 0,
          total_transfer_daily: 0,
          total_withdrawal_daily: 0,
          bvn_verified: true
        }
    ]);
  };
  