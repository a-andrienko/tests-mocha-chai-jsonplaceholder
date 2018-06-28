// require dev-dependencies
const chaiM: any = require('chai');
const chaiHttp: any  = require('chai-http');
import {expect} from 'chai';
const should = require('chai').should();

// require local dependencies
const server = 'https://jsonplaceholder.typicode.com';
const totalPostsNumber = 100;

// initialize use of http request
chaiM.use(chaiHttp);

// generate some mocked data 
interface SomePost {
    userId: number;
    title: string;
    body: string;
    id?: number;
}

let mockedPost: SomePost = {
    userId: 1,
    title: 'titleTest',
    body: 'some bodyText'
  };

var fakeId: number; 

describe('Posts test', () => {
    it('should fetch all posts', async () => {
        const res = await chaiM.request(server).get('/posts/');
        res.should.have.status(200);
        // there are 100 posts on the fake server API, or 101
        res.body.length.should.be.eql(totalPostsNumber + 1||totalPostsNumber);
   });

   it('should add a new post', async () => {
        // post a new post
        const res = await chaiM.request(server).post('/posts').send(mockedPost);
        res.should.have.status(201);   
        expect(res.body).to.have.property('id');
        mockedPost.id = res.body.id;
        fakeId = res.body.id;
        expect(res.body).to.be.deep.equal(mockedPost);

        // now we change id to a number in range 1-100 to proceed 
        // because we use a fake API
        // where the posts are not really added
        // and 100 mock posts are available
        fakeId = 5;
        const resGet = await chaiM.request(server).get(`/posts/${fakeId}`);
        resGet.should.have.status(200);       
   });

   it('should find the newly added post', async () => {
        const res = await chaiM.request(server).get(`/posts/${fakeId}`);
        res.should.have.status(200);       
    });

   it('should delete the newly added post', async () => {
        let res = await chaiM.request(server).delete(`/posts/${fakeId}`);
        res.should.have.status(200); 
    });

    // here we can try to find the post by id from post response

    it('should not find the newly deleted post', async () => {
        let res = await chaiM.request(server).get(`/posts/${mockedPost.id}`);
        res.should.have.status(404); 
    });
});
