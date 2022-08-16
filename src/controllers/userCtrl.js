const knex = require('../models/knex');
const { body} = require('express-validator');
const jwt = require('jsonwebtoken');

//
exports.validate = (method) => {
    switch (method) {
        case "createNewUser": {
            return [
                body("first_name").isString(), 
                body("last_name").isString(),
                body("email").isEmail(),
                body("dob").isString(),
                body("address").isString(),
                body("phone_number").isString(),
                body("bvn",).isNumeric().optional({nullable: true})
            ]
        }
    }
}
// ! make sure the number is exact length 11
// return [query("subCategory").isString(), query("categoryId").isUUID(), query("pageNo").isNumeric().optional({ nullable: true }), query("noOfRows").isNumeric().optional({ nullable: true })]

exports.createUser = async (req, res) => {
    const {email, address, bvn,} = req.body;
    const tier1 = 1;
    const tier2 = 2;
    const tier3 = 3;
    let accountType;
    let accountResult;
    try{
        // check if user exist using email or phone_number
        const selectRes = await  knex.select().from('users').where('email', email);
        
        if (selectRes.length > 0){
            return res.status(404).json({
                error: 'user already exists!'
            });
        }

        const userResult = await knex('users').insert(req.body);
        
        // no address no bvn tier 1
        // yes address no bvn tier 2
        // yes address yes bvn tier 3
        if (address && bvn) {
            accountType = 'tier 3';
            accountResult = await knex('accounts').insert({

                account_holder: userResult[0],
                account_type_id: tier3,
                balance: 0,
                total_transfer_daily: 0,
                total_withdrawal_daily: 0,
                bvn_verified: true,

            })
        }else if (address && !bvn){
            accountType = 'tier 2';
            accountResult = await knex('accounts').insert({

                account_holder: userResult[0],
                account_type_id: tier2,
                balance: 0,
                total_transfer_daily: 0,
                total_withdrawal_daily: 0,
                bvn_verified: false,

            });
        }else if (!address && !bvn){
            accountType = 'tier 1';
            accountResult = await knex('accounts').insert({

                account_holder: userResult[0],
                account_type_id: tier1,
                balance: 0,
                total_transfer_daily: 0,
                total_withdrawal_daily: 0,
                bvn_verified: false,

            });
        }
        
        jwt.sign({user_id: userResult[0], account_id: accountResult[0], email }, process.env.TOKEN_SECRET, { expiresIn: '365d' }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    error: 'Token was not generated'
                })
            }
            
            res.status(201).json({
                status: 'success',
                data: {
                    token,
                    message: `${accountType} account has been created!`
                }
            });
        });

    }catch(error){

        res.status(500).json({
            status: 'error',
            error: 'Something went wrong'
        })
    }
}
