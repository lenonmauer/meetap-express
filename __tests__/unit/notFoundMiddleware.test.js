const chai = require('chai');
const sinon = require('sinon');
const httpMock = require('node-mocks-http');

const notFoundMiddleware = require('../../src/app/middlewares/not-found');

const { expect } = chai;

describe('NotFound Middleware', () => {
  it('should be return status 404', async () => {
    const request = httpMock.createRequest();
    const response = httpMock.createResponse();

    const nextSpy = sinon.spy();

    notFoundMiddleware(request, response, nextSpy);

    expect(response.statusCode).to.be.eq(404);
    expect(nextSpy.calledOnce).to.be.true;
  });
});
