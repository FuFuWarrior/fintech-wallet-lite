const axios = require('axios').default
const knex = require('../models/knex');
const {body} = require('express-validator');
const {processInitialCardCharge} = require('../utils/cardUtils');
const { creditAccount } = require('../utils/transactionUtils');
const {convertNairaToKobo} = require('../utils/helpers');

exports.validate = (method) => {
  switch (method) {
      case "fundAccount": {
          return [
              body("number").isString(), 
              body("cvv").isNumeric(), 
              body("amount").isNumeric(),
              body("expiry_year").isNumeric(),
              body("expiry_month").isNumeric(),
          ]
      }
  }
}


exports.fundAccountWithCard = async (req, res) => {
    const {user_id, account_id, email} = req;
    const {number, cvv, expiry_year, expiry_month, amount} = req.body;

    const PAYSTACK_CHARGE_URL = 'https://api.paystack.co/charge';

     const account = await knex.select().from('accounts').where('id', account_id);

    if (account.length > 0){
        try {
          const koboAmount = convertNairaToKobo(amount);

          const charge = await axios.post(PAYSTACK_CHARGE_URL, {
              card: {
                number,
                cvv,
                expiry_year,
                expiry_month,
              },
              email,
              amount: koboAmount,
            }, {
              headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              },
            });
            
          const nextAction = processInitialCardCharge(charge.data);
          
          const card = await knex('card_transactions').insert(
            {
              external_reference: nextAction.data.reference,
              amount,
              account_id,
              last_response: nextAction.success ? nextAction.message : nextAction.error
            }
          );

          if (!nextAction.success) {
            return res.status(404).json({
              status: 'error',
              error: nextAction.error,
            }); 
          }

          const trx = await knex.transaction();      
          try {

            if (nextAction.data.shouldCreditAccount) {
              const creditResult = await creditAccount({
                amount,
                account_id,
                purpose: 'deposit',
                metadata: {
                  external_reference: nextAction.data.reference,
                },
                trx,
              });

              if (!creditResult.success) {
                await trx.rollback();

                return {
                  success: false,
                  error: creditResult.error,
                };
              }

              await trx.commit();

              res.status(200).json({
                status: 'success',
                data:{
                  message: 'your account has been funded'
                }
              })
            }

          } catch (error) {
            
            await trx.rollback();

            res.status(500).json({
              status: 'error',
              error: 'something unexpected happened'
            
            });
          }
      
      } catch (error) {

          console.error(error, 'error')

          if (error.response){
            console.error(error.response.data, 'error axios')
            return res.status(404).res.json({
              status : 'error',
              error: error.response.data.message
            })
          }
          
          res.status(500).json({
              status: 'error',
              error: 'something went wrong'
          })
      }
    }else{
      res.status(404).json({
        status: 'error',
        error: 'account does not exist'
      });
    }
}