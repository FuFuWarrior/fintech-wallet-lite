/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users').del()
    await knex('users').insert([
        {
            id: 1,
            first_name: 'Tinubu',
            last_name: 'Obi',
            email: 'tinubu@obi.com',
            dob: '1/2/2002',
            address: 'no 2 okolathom lalou',
            phone_number: '4873992',
            bvn: '38374747384',
        },
    ]);
  };
  