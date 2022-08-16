const chai = require('chai'), 
chaiHttp = require('chai-http');
const app = require('../src/app');
const {badToken} = require('./01_user.spec');
const goodToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MywiYWNjb3VudF9pZCI6NDEsImVtYWlsIjoiV2lrZTE5QGhvdG1haWwuY29tIiwiaWF0IjoxNjYwNTc2NzQ5LCJleHAiOjE2OTIxMTI3NDl9.E2S8TIE1o5E8BNQPZb_VK3rSFO2J4tJpyuHp-awU4mU'

chai.should();
chai.use(chaiHttp);

describe( 'POST account/fund' , () => {
    
    const cardDetails = {
        "number":"4084084084084081",
        "cvv": 408,
        "amount": 2000,
        "expiry_year": 2030,
        "expiry_month": 1
    }

    it( 'it should fund to account' , (done) => {
       
        chai.request(app)//one can use the direct localhost of PORT 'http://localhost:PORT'
          .post('/api/v1/account/fund')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${goodToken}`)
          .send(cardDetails)
          .end((err, res) => {
            res.should.have.status(200);
            done(err);
          });
    });

    it( 'it should not fund from an account', (done) => {
        chai.request(app)//one can use the direct localhost of PORT 'http://localhost:PORT'
          .post('/api/v1/account/fund')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${badToken}`)
          .send(cardDetails)
          .end((err, res) => {
            res.should.have.status(401);
            done(err);
          });
    }) 
});
