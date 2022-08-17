const faker = require('faker')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 const firstName = faker.name.firstName();
 const lastName = faker.name.lastName();
 const email = faker.internet.email( firstName, lastName );
 const phoneNumber = faker.random.numeric(11);
 const bvn = faker.random.numeric(11);

 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users').del()
    await knex('users').insert([
        {
            id: 1,
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: 'email@email.com',
            dob: '1/2/2002',
            address: 'no 2 okolathom lalou',
            phone_number: faker.random.numeric(11),
            bvn: faker.random.numeric(11)
        },
    ]);
  };
  