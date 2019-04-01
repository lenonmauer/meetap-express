const chai = require('chai');
const { expect } = chai;

const matchPasswordValidator = require('../../src/app/validations/custom-validations/match-password');

describe('MatchPassword Validator', () => {
  it('should return true when date is valid', async () => {
    const req = {
      body: {
        password: '123123',
      },
    };

    const valid = matchPasswordValidator('password')('123123', { req });

    expect(valid).to.be.eq(true);
  });

  it('should return false when date is invalid', async () => {
    const req = {
      body: {
        password: '123123',
      },
    };

    const valid = matchPasswordValidator('password')('1231232', { req });

    expect(valid).to.be.eq(false);
  });
});
