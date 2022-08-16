const knex = require('../models/knex');
const {body} = require('express-validator');
const {validNubans} = require('../models/nubans.json');
const {debitAccount} = require('../utils/transactionUtils')


exports.validate = (method) => {
    switch (method) {
        case "withdrawFund": {
            return [
                body("amount").isNumeric(), 
                body("account_number").isNumeric()
            ]
        }
    }
}

exports.withdraw = async (req, res) => {
    const{user_id, account_id} = req
    const {account_number, amount} = req.body;
  
    const account = await knex.from('accounts').innerJoin('account_types', 'accounts.account_type_id', 'account_types.id').where('accounts.id', account_id);
    const user = await knex.select().from('users').where('id', user_id);

    if (account.length === 0){
        return res.status(404).json({
            status: 'error',
            error: 'account doesn\'t exist'
        })
    }

    const arr = validNubans.filter(nuban => nuban.nuban === account_number)

    if (!arr[0]){
        return res.status(404).json({
            status: 'error',
            error: 'nuban doesn\'t exist'
        });
    }

    const fullName = `${user[0].first_name} ${user[0].last_name}`

    if( arr[0].account_name.toLowerCase() !== fullName.toLowerCase()){
        return res.status(400).json({
            status: 'error',
            error: 'name doesn\'t match the account name'
        })
    }
    const senderNewBalance = account[0].balance - amount;
    const currentTotalWithdrawDaily = account[0].total_withdrawal_daily + amount;

    if (0 <= senderNewBalance){
        if (currentTotalWithdrawDaily <= account[0].withdrawal_daily_limit){
            if (amount <= account[0].withdrawal_limit_per_txn){

                const metadata = {
                    sender: account_id,
                    receiver: account_number,
                    senderNewBalance,
                    senderOldBalance: account[0].balance,
                    transferType: 'withdrawal'
                }
                const trx = await knex.transaction();

                try {
                    const debitResult = await debitAccount({amount, account_id, purpose: 'withdrawal', trx, account_number, metadata});

                    if (!debitResult.success){
                        await trx.rollback()
                        return res.status(400).json({
                            status: 'error',
                            error: 'withdraw unsuccessful'
                        });
                    }

                    trx.commit();
                    return res.status(200).json({
                        status: 'success',
                        data: {
                           message: 'withdrawal successful'
                        }
                    });

                } catch (error) {
                    await trx.rollback();

                    res.status(500).json({
                        status: 'error',
                        error: 'something unexpected happened'
                    });
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
    }else{
        res.status(400).json({
            status: 'error',
            error: 'insufficient funds'
        });
    }
}