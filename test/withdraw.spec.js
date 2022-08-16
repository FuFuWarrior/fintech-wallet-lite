const chai = require('chai'), 
chaiHttp = require('chai-http');
const app = require('../src/app');
const {badToken} = require('./01_user.spec');
const goodToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MywiYWNjb3VudF9pZCI6NDEsImVtYWlsIjoiV2lrZTE5QGhvdG1haWwuY29tIiwiaWF0IjoxNjYwNTc2NzQ5LCJleHAiOjE2OTIxMTI3NDl9.E2S8TIE1o5E8BNQPZb_VK3rSFO2J4tJpyuHp-awU4mU'

chai.should();
chai.use(chaiHttp);

describe( 'POST account/withdraw' , () => {
    const withdrawalDetails = {
        "amount": 10,
        "account_number": 1234567890
    }

    it( 'it should withdraw from account' , (done) => {
       
         
        chai.request(app)//one can use the direct localhost of PORT 'http://localhost:PORT'
          .post('/api/v1/account/withdraw')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${goodToken}`)
          .send(withdrawalDetails)
          .end((err, res) => {
            res.should.have.status(200);
            done(err);
          });
    });

    it( 'it should not withdraw from an account', (done) => {
        chai.request(app)//one can use the direct localhost of PORT 'http://localhost:PORT'
          .post('/api/v1/account/withdraw')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${badToken}`)
          .send(withdrawalDetails)
          .end((err, res) => {
            res.should.have.status(401);
            done(err);
          });
    }) 
});