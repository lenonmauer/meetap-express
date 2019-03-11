const chai = require('chai');
const { expect } = chai;

const dateBrValidator = require('../../src/app/validations/custom-validations/date-br');

describe('DateBR Validator', () => {
  it('should return true when date is valid', async () => {
    const date1 = dateBrValidator('12/03/2014');
    const date2 = dateBrValidator('28/02/2015');
    const date3 = dateBrValidator('29/02/2016');

    expect(date1).to.be.eq(true);
    expect(date2).to.be.eq(true);
    expect(date3).to.be.eq(true);
  });

  it('should return false when date is invalid', async () => {
    const invalidDate1 = dateBrValidator('31/04/2015');
    const invalidDate2 = dateBrValidator('29/02/2015');
    const invalidDate3 = dateBrValidator('29-02-201');

    expect(invalidDate1).to.be.eq(false);
    expect(invalidDate2).to.be.eq(false);
    expect(invalidDate3).to.be.eq(false);
  });
});
