const chai = require('chai');
const { expect } = chai;

const objectIdValidator = require('../../src/app/validations/custom-validations/object-id');

describe('ObjectId Validator', () => {
  it('should return true when date is valid', async () => {
    const valid = objectIdValidator('5c830a8d9d64c1295c0cd086');

    expect(valid).to.be.eq(true);
  });

  it('should return false when date is invalid', async () => {
    const invalid = objectIdValidator('5c830a8d9d64c1295c0cd0862');

    expect(invalid).to.be.eq(false);
  });
});
