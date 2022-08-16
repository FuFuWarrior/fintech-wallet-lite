const chai = require('chai'), 
chaiHttp = require('chai-http');
const app = require('../src/app');
const {badToken} = require('./01_user.spec');
const goodToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MywiYWNjb3VudF9pZCI6NDEsImVtYWlsIjoiV2lrZTE5QGhvdG1haWwuY29tIiwiaWF0IjoxNjYwNTc2NzQ5LCJleHAiOjE2OTIxMTI3NDl9.E2S8TIE1o5E8BNQPZb_VK3rSFO2J4tJpyuHp-awU4mU'

chai.should();
chai.use(chaiHttp);

describe( 'POST account/transfer' , () => {
    
    const transferDetails = {
      "amount": 600,
      "receiver_email": "Micah47@gmail.com"
    }

    it( 'it should transfer from account' , (done) => {
       
        chai.request(app)//one can use the direct localhost of PORT 'http://localhost:PORT'
          .post('/api/v1/account/transfer')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${goodToken}`)
          .send(transferDetails)
          .end((err, res) => {
            res.should.have.status(200);
            done(err);
          });
    });

    it( 'it should not transfer from an account', (done) => {
        chai.request(app)//one can use the direct localhost of PORT 'http://localhost:PORT'
          .post('/api/v1/account/transfer')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${badToken}`)
          .send(transferDetails)
          .end((err, res) => {
            res.should.have.status(401);
            done(err);
          });
    }) 
});