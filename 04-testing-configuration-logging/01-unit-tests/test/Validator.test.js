const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет тип поля name', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10
        }
      });

      const errors = validator.validate({ name: 1});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').equal('name')
      expect(errors[0]).to.have.property('error').equal('expect string, got number')
    });
    it('валидатор проверяет min поля name', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10
        }
      });

      const errors = validator.validate({ name: 'lala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').equal('name')
      expect(errors[0]).to.have.property('error').equal('too short, expect 5, got 4')
    });
    it('валидатор проверяет max поля name', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10
        }
      });

      const errors = validator.validate({ name: 'lalalalalalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').equal('name')
      expect(errors[0]).to.have.property('error').equal('too long, expect 10, got 14')
    });
    it('валидатор проверяет тип поля age', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10
        }
      });

      const errors = validator.validate({ age: 'ff'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').equal('age')
      expect(errors[0]).to.have.property('error').equal('expect number, got string')
    });
    it('валидатор проверяет min поля age', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10
        }
      });

      const errors = validator.validate({ age: 4});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').equal('age')
      expect(errors[0]).to.have.property('error').equal('too little, expect 5, got 4')
    });
    it('валидатор проверяет max поля age', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10
        }
      });

      const errors = validator.validate({ age: 20 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').equal('age')
      expect(errors[0]).to.have.property('error').equal('too big, expect 10, got 20')
    });
  });
});