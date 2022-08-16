# Fintech App

This is a fintech app built [Node.js](https://nodejs.org/en/download), [Express.js](http://expressjs.com/), [MySQL](https://dev.mysql.com/downloads/mysql/) and [paystack](https://paystack.com/)

## Getting Started

1. You need to have [Node.js](https://nodejs.org/en/download) and [MySQL](https://dev.mysql.com/downloads/mysql/) installed. 
2. Install project dependencies by running `npm install`.
3. Create a `.env` file in the root directory and add your "data"bae details. It should have the following properties:

- DB_HOST=
- DB_USERNAME=
- DB_PASSWORD=
- DB_NAME=
- DB_PORT=
- DB_NAME=
- PAYSTACK_SECRET_KEY=
- TOKEN_SECRET=

1. Run the migrations to create "data"base tables and seeding `account_types` table "data"base by running `npm run migrate:seed`.
2. You need would need to create a paystack account and copy the secret key on the dashboard.
3. When running test through `npm test` make sure the save the token logged to the console, which would be used in the next test. Please note in the first test run not all test would pass.

## Create a User

This create a user and account using this payload:

**NOTE**: *Please use name firstname and lastname or change the name in the `nuban.json` file in the `models` folder. Upon withdrawal the name must match the user's name*

```json
{
  "first_name": "Wike",
  "last_name": "Atiku",
  "email": "string",
  "dob":" string",
  "address": "string",
  "phone_number":"string",
  "bvn": "string"
}
```

There are three types of account available for a user, these account also come with restrictions

1. Tier 1 (no bvn and no address)
2. Tier 2 (yes address and no bvn)
3. Tier 3 (yes address and yes bvn)

On success it will return with this response

``` json
{
    "data": {
      "status": "success",
      "data":{
        "token": "string",
        "message": "tier 3 account has been opened"
      }
    }
}
```

**NOTE**: *Save the token returned in the Authorization header like `Bearer token` and use it in the subsequent request, if not you would get `401` error. If the Authourization is not saved as `Bearer token` it would return a `401` error*

## Funding an Account

This allow a user to fund the account using their debit card using `paystack` :

```json
{
  "number": "4084084084084081",
  "cvv": 408,
  "amount": 200,
  "expiry_year": 2030,
  "expiry_month": 1
}
```

On success it will return with this response

``` json
{
  "data":{
    "status":"success",
    "message": "your account has been funded"
  }
}
```

## Transfer Fund to Another User's Account

This allows the user to transfer fund from a account to another user's account

```json
{
  "amount": 600,
  "receiver_email": "string"
}
```
On success it will return with this response

```json
{
  "status": "success",
  "data": {
      "message": "transfer successful"
  }
}
```

## Withdraw Fund

This allows a users to withdraw fund.

```json
{
  "amount": 10,
  "account_number": 1234567890
}
```

On success it would return

```json
{
  "status": "success",
  "data": {
      "message": "withdrawal successful"
  }
}
```
