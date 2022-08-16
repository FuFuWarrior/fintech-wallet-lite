const {v4} = require('uuid');
const knex = require('../models/knex');



const creditAccount = async ({
    amount, account_id, purpose, reference = v4(), metadata = null, trx,
    }) => {
        if (purpose === 'deposit'){
            const account = await knex.select().from('accounts').where('id', account_id)
            // const account = await models.accounts.findOne({ where: { id: account_id } });
    
            if (account.length === 0) {
                return {
                success: false,
                error: 'Account does not exist',
                };
            }

            await trx('accounts').where('id', '=', account_id).increment('balance', amount);

            await trx('transactions').insert({
                txn_type: 'credit',
                purpose,
                amount,
                account_id,
                txn_reference: reference,
                metadata,
                balance_before: Number(account[0].balance),
                balance_after: Number(account[0].balance) + Number(amount)
            });
            
    
            return {
                success: true,
                message: 'credit successful',
            };
        }else if(purpose === 'transfer'){
        
            const account = await knex.select().from('accounts').where('id', metadata.receiver);
    
            if (account.length === 0) {
                return {
                    success: false,
                    error: 'Account does not exist',
                };
            }

            await trx('accounts').where('id', '=', metadata.receiver).increment('balance', amount);
           
            await trx('transactions').insert({
                txn_type: 'credit',
                purpose,
                amount,
                account_id: metadata.receiver,
                txn_reference: reference,
                metadata,
                balance_before: metadata.receiverOldBalance,
                balance_after: metadata.receiverNewBalance
            });

            return{
                success: true,
                message: 'credit successful'
            }

        }
}


const debitAccount = async ({
    amount, account_id, purpose, reference = v4(), metadata, trx,
    }) => {
         if(purpose === 'transfer'){
            const account = await knex.select().from('accounts').where('id', account_id);
    
            if (account.length === 0) {
                return {
                    success: false,
                    error: 'account does not exist',
                };
            }
            
            await trx('accounts').update({balance: metadata.senderNewBalance}).where('id', account_id) 
            await trx('accounts').where('id', '=', account_id).increment('total_transfer_daily', amount);

            await trx('transactions').insert({
                txn_type: 'debit',
                purpose,
                amount,
                account_id: account_id,
                txn_reference: reference,
                metadata,
                balance_before: Number(account[0].balance),
                balance_after: Number(account[0].balance) - Number(amount)
            });

            return{
                success: true,
                message: 'debit successful'
            }
        }else if (purpose === 'withdrawal'){
                
            const account = await knex.select().from('accounts').where('id', account_id);

                if (account.length === 0) {
                    return {
                        success: false,
                        error: 'account does not exist',
                    };
                }
                
                await trx('accounts').update({balance: metadata.senderNewBalance}).where('id', account_id) 
                await trx('accounts').where('id', '=', account_id).increment('total_withdrawal_daily', amount);
    
                await trx('transactions').insert({
                    txn_type: 'debit',
                    purpose,
                    amount,
                    account_id: account_id,
                    txn_reference: reference,
                    metadata,
                    balance_before: Number(account[0].balance),
                    balance_after: Number(account[0].balance) - Number(amount)
                });
    
                return{
                    success: true,
                    message: 'debit successful'
                }   
        
    }
}


module.exports = {
    creditAccount,
    debitAccount
}