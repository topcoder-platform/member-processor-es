/**
 * Service for member processor.
 */
const _ = require('lodash')
const Joi = require('joi')
const logger = require('../common/logger')
const helper = require('../common/helper')
const config = require('config')

const client = helper.getESClient()

/**
 * Get elastic search data.
 * @param {String} id the Elastic search data id
 * @returns {Object} Data from Elastic search
 */
function * getESData (id) {
  return yield client.getSource({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

/**
 * Get message in Elasticsearch.
 * @param {String} id the Elasticsearch record id
 * @param {Object} message the message
 */
function * get (id) {
  return client.get({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  })
}

/**
 * Create message in Elasticsearch.
 * @param {String} id the Elasticsearch record id
 * @param {Object} message the message
 */
function * create (id, message) {
  yield client.create({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id,
    body: message
  })
}

/**
 * Create message in Elasticsearch.
 * @param {String} id the Elasticsearch record id
 * @param {Object} message the message
 */
function * index (id, message) {
  yield client.index({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id,
    body: message
  })
}

/**
 * Update message in Elasticsearch.
 * @param {String} id the Elasticsearch record id
 * @param {Object} message the message
 */
function * update (id, message) {
  yield client.update({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id,
    body: { doc: message }
  })
}

/**
 * Remove messages in Elasticsearch.
 * @param {Array} ids the Elasticsearch record ids
 */
function * remove (ids) {
  // remove records in parallel
  yield _.map(ids, (id) => client.delete({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id
  }))
}

/**
 * Create profile message in Elasticsearch.
 * @param {Object} message the message
 */
function * createProfile (message) {
  yield create(message.payload.userId, message.payload)
}

createProfile.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required()
    }).unknown(true).required()
  }).required()
}

/**
 * Update profile message in Elasticsearch.
 * @param {Object} message the message
 */
function * updateProfile (message) {
  yield update(message.payload.userId, message.payload)
}

updateProfile.schema = createProfile.schema

/**
 * Remove profile message in Elasticsearch.
 * @param {Object} message the message
 */
function * removeProfile (message) {
  yield remove([message.payload.userId])
}

removeProfile.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required()
    }).required()
  }).required()
}

/**
 * Create trait message in Elasticsearch.
 * @param {Object} message the message
 */
function * createTrait (message) {
  let source = {};
  try {
    source = yield getESData(message.payload.userId)
  } catch (e) {
    console.log(JSON.stringify(e))
    source = {}
  }
  if (!source.traits) {
      source.traits = []
  }
  const traits = message.payload.traits
  delete message.payload.traits
  source = Object.assign(source, message.payload);
  var basicInfo = false
  for (var value of traits) {
    if (value.traitId == 'basic_info') {
      basicInfo = true
    }
    var foundIndex = source.traits.findIndex(x => x.traitId == value.traitId)
    if (foundIndex >= 0) {
      source.traits[foundIndex] = value
    } else {
      source.traits.push(value)
    }
  }  
  if (basicInfo) {
    yield index(message.payload.userId, source)
  } else {
    yield update(message.payload.userId, {traits: source.traits, updatedAt: message.payload.updatedAt, updatedBy: message.payload.update})
  }
}

createTrait.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      updatedAt: Joi.string().required(),
      updatedBy: Joi.string().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Update trait message in Elasticsearch.
 * @param {Object} message the message
 */
function * updateTrait (message) {
  let source = {};
  try {
    source = yield getESData(message.payload.userId)
  } catch (e) {
    console.log(JSON.stringify(e))
    source = {}
  }
  if (!source.traits) {
      source.traits = []
  }
  const traits = message.payload.traits
  delete message.payload.traits
  source = Object.assign(source, message.payload);
  var basicInfo = false
  for (var value of traits) {
    if (value.traitId == 'basic_info') {
      basicInfo = true
    }
    var foundIndex = source.traits.findIndex(x => x.traitId == value.traitId)
    source.traits[foundIndex] = value;
  }
  if (basicInfo) {
    yield update(message.payload.userId, source)
  } else {
    yield update(message.payload.userId, {traits: source.traits, updatedAt: message.payload.updatedAt, updatedBy: message.payload.update})
  }
}

updateTrait.schema = createTrait.schema

/**
 * Remove trait message in Elasticsearch.
 * @param {Object} message the message
 */
function * removeTrait (message) {
  const source = yield getESData(message.payload.userId)
  if (!source.traits || source.traits.length == 0) {
    return
  }
  source.traits = source.traits.filter(function(el) {
    return message.payload.memberProfileTraitIds.findIndex(x => x == el.traitId) < 0
  })
  if (message.payload.memberProfileTraitIds.length == 0) {
    source.traits = []
  }
  yield update(message.payload.userId, {traits: source.traits, updatedAt: message.payload.updatedAt, updatedBy: message.payload.update})
}

removeTrait.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      memberProfileTraitIds: Joi.array().required(),
      updatedAt: Joi.string().required(),
      updatedBy: Joi.string().required()
    }).required()
  }).required()
}

/**
 * Create photo message in Elasticsearch.
 * @param {Object} message the message
 */
function * createPhoto (message) {
  yield update(message.payload.userId, {photoURL: message.payload.photoURL, updatedAt: message.payload.updatedAt, updatedBy: message.payload.updatedBy})
}

createPhoto.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      photoURL: Joi.string().uri().required(),
      updatedAt: Joi.string().required(),
      updatedBy: Joi.string().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Update photo message in Elasticsearch.
 * @param {Object} message the message
 */
function * updatePhoto (message) {
  yield update(message.payload.userId, {photoURL: message.payload.photoURL, updatedAt: message.payload.updatedAt, updatedBy: message.payload.updatedBy})
}

updatePhoto.schema = createPhoto.schema

// Exports
module.exports = {
  createProfile,
  updateProfile,
  removeProfile,
  createTrait,
  updateTrait,
  removeTrait,
  createPhoto,
  updatePhoto
}

logger.buildService(module.exports)
