/**
 * Contains helper methods for tests
 */

const _ = require('lodash')
const config = require('config')
const expect = require('chai').expect
const helper = require('../../src/common/helper')

const client = helper.getESClient()

/**
 * Get elastic search data.
 * @param {String} id the Elastic search data id
 * @returns {Object} the elastic search data of id of configured index type in configured index
 */
function * getESData (id) {
  return yield client.getSource({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

/**
 * Remove elastic search data.
 * @param {String} id the Elastic search data id
 */
function * removeESData (id) {
  return yield client.delete({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

/**
 * Ensures the target object match all fields/values of the expected object.
 * @param {Object} target the target object
 * @param {Object} expected the expected object
 */
function expectObject (target, expected) {
  _.forIn(expected, (value, key) => {
    if (target[key] instanceof Array) {
      expect(target[key].length).to.equal(value.length)
    } else {
	  expect(target[key]).to.equal(value)
    }
  })
}

/**
 * Merge objects.
 * @param {Object} obj1 the object 1
 * @param {Object} obj2 the object 2
 * @returns {Object} the merged object
 */
function mergeObj (obj1, obj2) {
  return _.assignIn({}, obj1, obj2)
}

module.exports = {
  getESData,
  removeESData,
  expectObject,
  mergeObj
}
