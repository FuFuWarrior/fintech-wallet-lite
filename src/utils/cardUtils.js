
function processInitialCardCharge(chargeResult) {
    if (chargeResult.data.status) {
      return {
        success: true,
        message: chargeResult.data.status,
        data: {
          shouldCreditAccount: true,
          reference: chargeResult.data.reference,
        },
      };
    }
  
    return {
      success: false,
      error: chargeResult.data.status,
      data: {
        shouldCreditAccount: false,
        reference: chargeResult.data.reference,
      },
    };
  }

  async function completeSuccessfulCharge({ accountId, reference, amount }) {
    await models.card_transactions.update({ last_response: 'success' }, { where: { external_reference: reference } });
    const t = await models.sequelize.transaction();
    const creditResult = await creditAccount({
      account_id: accountId,
      amount,
      purpose: 'card_funding',
      t,
      metadata: {
        external_reference: reference,
      },
    });
    if (!creditResult.success) {
      await t.rollback();
      return {
        success: false,
        error: creditResult.error,
      };
    }
    await t.commit();
    return {
      success: true,
      message: 'Account successfully credited',
    };
  }

module.exports = {
    processInitialCardCharge,
    completeSuccessfulCharge
}