const chai = require('chai'), 
chaiHttp = require('chai-http');
const app = require('../src/app');
const {faker} = require('@faker-js/faker');

chai.should();
chai.use(chaiHttp);

const badToken = 'kjadfijoaiehhlkal80940klajdkfjakjk.jao09-ladf';

describe('POST user/create', () => {
  
    const email = faker.internet.email(faker.name.firstName(), faker.name.lastName());
    const phoneNumber = faker.random.numeric(11);
    const bvn = faker.random.numeric(11);
    
    const userDetails = {
      "first_name": "Wike",
      "last_name": "Atiku",
      "email":email,
      "dob": "1/2/2002",
      "address": "no 2 okolathom lalou",
      "phone_number": phoneNumber,
      "bvn": bvn
    }

    it('create a user correct details with the diff users details', (done) => {

        chai.request(app)//one can use the direct localhost of PORT 'http://localhost:PORT'
          .post('/api/v1/user/create')
          .set('Content-Type', 'application/json')
          .send(userDetails)
          .end((err, res) => {
            res.should.have.status(201);
            // goodToken = res.body.data.token;
            console.log(res.body.data.token)
            done(err);
          });
      });

      it('create a user correct details without appropriate type', ((done) => {
        
        const userDetails = {
            "first_name": "Wike",
            "last_name": "Atiku",
            "email": email,
            "dob": "1/2/2002",
            "address": "no 2 okolathom lalou",
            "phone_number": phoneNumber,
            "bvn": bvn
          }

        chai.request(app)//one can use the direct localhost of PORT 'http://localhost:PORT'
          .post('/api/v1/user/create')
          .set('Content-Type', 'application/json')
          .send(userDetails)
          .end((err, res) => {
            res.should.have.status(404);
            done(err);
          });
      }));
});

module.exports = {badToken}