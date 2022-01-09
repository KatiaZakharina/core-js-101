/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.height * this.width;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor() {
    this.value = '';
    this.errorMessage = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.orderErrorMessage = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  addValue(value, symbol = '') {
    this.value += `${symbol}${value}`;
    return this;
  }

  element(value) {
    if (
      this.value.match('#')
      || this.value.match(/\./)
      || this.value.match(/\[/)
      || this.value.match(':')
      || this.value.match('::')
    ) {
      return this.incorrectSelectorsOrder();
    }
    if (!this.value) return this.addValue(value);
    return this.incorrectSelector();
  }

  id(value) {
    if (this.value.match(/\./)
      || this.value.match(/\[/)
      || this.value.match(':')
      || this.value.match('::')
    ) {
      return this.incorrectSelectorsOrder();
    }
    if (!this.value.match('#')) return this.addValue(value, '#');
    return this.incorrectSelector();
  }

  class(value) {
    if (this.value.match(/\[/)
    || this.value.match(':')
    || this.value.match('::')
    ) {
      return this.incorrectSelectorsOrder();
    }
    return this.addValue(value, '.');
  }

  attr(value) {
    if (this.value.match(':')
    || this.value.match('::')
    ) {
      return this.incorrectSelectorsOrder();
    }
    this.value += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.value.match('::')
    ) {
      return this.incorrectSelectorsOrder();
    }
    return this.addValue(value, ':');
  }

  pseudoElement(value) {
    if (!this.value.match('::')) return this.addValue(value, '::');
    return this.incorrectSelector();
  }

  stringify() {
    const { value } = this;
    return value;
  }

  incorrectSelector() {
    throw new Error(this.errorMessage);
  }

  incorrectSelectorsOrder() {
    throw new Error(this.orderErrorMessage);
  }
}

const cssSelectorBuilder = {
  element(value) {
    const selector = new Selector();
    return selector.element(value);
  },

  id(value) {
    const selector = new Selector();
    return selector.id(value);
  },

  class(value) {
    const selector = new Selector();
    return selector.class(value);
  },

  attr(value) {
    const selector = new Selector();
    return selector.attr(value);
  },

  pseudoClass(value) {
    const selector = new Selector();
    return selector.pseudoClass(value);
  },

  pseudoElement(value) {
    const selector = new Selector();
    return selector.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const first = selector1.stringify();
    const comb = ` ${combinator} `;
    const second = selector2.stringify();
    return new Selector().element(first + comb + second);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
