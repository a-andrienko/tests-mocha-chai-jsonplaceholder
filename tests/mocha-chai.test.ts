// require dev-dependencies
const chai: any = require('chai');
const chaiHttp: any  = require('chai-http');
const expect: any  = require('chai').expect;
const should: any  = require('chai').should();

// require local dependencies
import {server, totalPostsNumber} from '../mocha-chai';

// initialize use of http requestscle
chai.use(chaiHttp);

// generate some mocked data 
let generatedId: number = new Date().getTime();
let mockedPost: object = {
    userId: 1,
    id: generatedId,
    title: 'titleTest',
    body: 'some bodyText'
  };


describe('Posts test', () => {

    it('should fetch all posts', (done) => {
       chai.request(server)
           .get('/posts/')
           .end((err, res) => {
                res.should.have.status(200);
                res.body.length.should.be.eql(totalPostsNumber);
                done();
           })
   });

   it('should send an error if the path is invalid', (done) => {
    chai.request(server)
        .get('/postsasdf/')
        .end((err, res) => {
            res.should.have.status(404);
            done();
        })
   });

   it('should add a new post with a sucess status', (done) => {
       chai.request(server)
            .post('/posts')
            .send(mockedPost)
            .end((err, res) => {
                if (err) {return done(err)};            
                res.should.have.status(201);
                expect(res.body).to.deep.equal(mockedPost);
                // res.body.length.should.be.eql(totalPostsNumber + 1);
                done();
            })
   });

   generatedId = 45;

   it('should delete a newly added post', (done) => {
    chai.request(server)
         .delete(`/posts/${generatedId}`)
         .end((err, res) => {
             res.should.have.status(200); 
             done();
         })
    })
});
