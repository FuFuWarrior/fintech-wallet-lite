const knex = require('../models/knex');
const {body} = require('express-validator');
const {creditAccount, debitAccount} = require('../utils/transactionUtils');


exports.validate = (method) => {
    
    switch (method) {
        case "transferFund": {
            return [
                body("amount").isNumeric(), 
                body("receiver_email").isEmail(),
            ]
        }
    }
}

exports.transfer = async (req, res) => {
    const {user_Id, account_id} = req;
    const {amount, receiver_email} = req.body;
    
    try {
        
        const senderAccount = await knex.select().from('accounts').innerJoin('account_types', 'accounts.account_type_id', 'account_types.id').where('accounts.id', account_id);
   
        const receiver = await knex.select().from('users').where('email', receiver_email);
        
        if (receiver.length > 0){
            const receiverId = receiver[0].id;
            const receiverAccount = await knex.select().from('accounts').where('account_holder', receiverId);
            // const receiverAccountType = await knex.select().from('account_types').where('id', receiverAccount[0].account_type );

            if (receiverAccount.length > 0){
                // check if the total limit has been passed

                const totalTransferDaily = senderAccount[0].total_transfer_daily;
                const transferDailyLimit = senderAccount[0].transfer_daily_limit;
                const currentTotalTransferDaily = totalTransferDaily + amount;
                const transferLimitPerTxn = senderAccount[0].transfer_limit_per_txn;
                

                // sender
                const senderAccountBalance = senderAccount[0].balance;
                // receiver
                const receiverAccountBalance = receiverAccount[0].balance;
               
                if (currentTotalTransferDaily <= transferDailyLimit){
                    if (amount <= transferLimitPerTxn){
                        // check if the amount exists the balance
                        const senderNewBalance = senderAccountBalance - amount;

                        if (senderNewBalance < 0){
                            res.status(400).json({
                                status: 'error',
                                error: 'insufficient funds'
                            });
                        }else{
                            const receiverNewBalance = receiverAccountBalance + amount;
                            
                            const metadata = {
                                sender: account_id,
                                receiver: receiverId,
                                receiverNewBalance,
                                senderNewBalance,
                                senderOldBalance: senderAccount[0].balance,
                                receiverOldBalance: receiverAccount[0].balance,
                                transferType: 'Internal'
                            }

                            const trx = await knex.transaction();
                            try {

                                const creditResult = await creditAccount({amount, account_id, purpose: 'transfer', trx, receiverId, metadata});
                                const debitResult = await debitAccount({amount, account_id, purpose: 'transfer', trx, receiverId, metadata});

                                if (!creditResult.success || !debitResult.success){
                                    await trx.rollback()
                                    return res.status(400).json({
                                        status: 'error',
                                        error: 'transfer unsuccessful'
                                    });
                                }

                                trx.commit()
                                return res.status(200).json({
                                    status: 'success',
                                    data: {
                                       message: 'transfer successful'
                                    }
                                });
                                
                            } catch (error) {
                                trx.rollback()

                                res.status(500).json({
                                    status: 'error',
                                    error: 'something unexpected happened'
                                })
                            }
                            
                        }
                    }else{
                        res.status(400).json({
                            status: 'error',
                            error: `${amount} is over the limit allowed per transaction`
                        });
                    }
                }else{
                    res.status(400).json({
                        status: 'error',
                        error: 'you are trying to send over your daily transfer limit'
                    });
                }
                //? add the current amount of transfer to the total amount transferred that day compare against account_types.
            }else{
                res.status(404).json({
                    status: 'error',
                    error: 'account does not exist'
                });
            }
        }else{
            res.status(404).json({
                status: 'error',
                error: 'user does not exist'
            });
        }
    } catch (error) {
        
        res.status(500).json({
            status: 'error',
            error: 'something unexpected happened'
        })
    }
}