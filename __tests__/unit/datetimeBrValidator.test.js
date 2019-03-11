const chai = require('chai');
const { expect } = chai;

const dateTimeBrValidator = require('../../src/app/validations/custom-validations/datetime-br');

describe('DatetimeBR Validator', () => {
  it('should return true when date is valid', async () => {
    const date1 = dateTimeBrValidator('12/03/2014 00:01');
    const date2 = dateTimeBrValidator('28/02/2015 12:01');
    const date3 = dateTimeBrValidator('29/02/2016 23:59');

    expect(date1).to.be.eq(true);
    expect(date2).to.be.eq(true);
    expect(date3).to.be.eq(true);
  });

  it('should return false when date is invalid', async () => {
    const dateWithoutTime = dateTimeBrValidator('12/03/2014');
    const invalidDate = dateTimeBrValidator('29/02/2015 12:01');
    const invalidDate2 = dateTimeBrValidator('29-02-205 12:01');

    expect(dateWithoutTime).to.be.eq(false);
    expect(invalidDate).to.be.eq(false);
    expect(invalidDate2).to.be.eq(false);
  });
});
