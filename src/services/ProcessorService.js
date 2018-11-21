/**
 * Service for member processor.
 */
const _ = require('lodash')
var moment = require('moment')
const Joi = require('joi')
const logger = require('../common/logger')
const helper = require('../common/helper')
const config = require('config')
const { PROFILE_RESOURCE, TRAIT_RESOURCE, PHOTO_RESOURCE } = require('../constants')

const client = helper.getESClient()

/**
 * Convert payload.
 * @param {Object} payload the payload
 * @return {Object} the converted payload
 */
function convertPayload (payload) {
  if (payload.hasOwnProperty('createdAt')) {
    if (payload.createdAt) {
      payload.createdAt = moment(payload.createdAt).valueOf()
    } else {
      payload.createdAt = moment().valueOf()
    }
  }

  if (payload.hasOwnProperty('updatedAt')) {
    if (payload.updatedAt) {
      payload.updatedAt = moment(payload.updatedAt).valueOf()
    } else {
      payload.updatedAt = moment().valueOf()
    }
  }

  if (payload.hasOwnProperty('traits')) {
    if (payload.traits.hasOwnProperty('data')) {
      if (payload.traits.data[0].hasOwnProperty('birthDate')) {
        payload.traits.data[0].birthDate = moment(payload.traits.data[0].birthDate).valueOf()
      }
    }
  }
  return payload
}

/**
 * Create message in Elasticsearch.
 * @param {String} id the Elasticsearch record id
 * @param {Object} message the message
 */
function * create (id, type, message) {
  yield client.create({
    index: config.get('esConfig.ES_INDEX'),
    type: type,
    id,
    body: convertPayload(message.payload)
  })
}

/**
 * Update message in Elasticsearch.
 * @param {String} id the Elasticsearch record id
 * @param {Object} message the message
 */
function * update (id, type, message) {
  convertPayload(message.payload)
  yield client.update({
    index: config.get('esConfig.ES_INDEX'),
    type: type,
    id,
    body: { upsert: message.payload, doc: message.payload }
  })
}

/**
 * Remove messages in Elasticsearch.
 * @param {Array} ids the Elasticsearch record ids
 */
function * remove (ids, type) {
  // remove records in parallel
  yield _.map(ids, (id) => client.delete({
    index: config.get('esConfig.ES_INDEX'),
    type: type,
    id
  }))
}

/**
 * Create profile message in Elasticsearch.
 * @param {Object} message the message
 */
function * createProfile (message) {
  yield create(`${message.payload.userId}`, `${config.get('esConfig.ES_PROFILE_TYPE')}`, message)
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
  yield update(`${message.payload.userId}`, `${config.get('esConfig.ES_PROFILE_TYPE')}`, message)
}

updateProfile.schema = createProfile.schema

/**
 * Remove profile message in Elasticsearch.
 * @param {Object} message the message
 */
function * removeProfile (message) {
  yield remove([`${message.payload.userId}`])
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
  yield create(`${message.payload.userId}${message.payload.traits.traitId}`, `${config.get('esConfig.ES_PROFILE_TRAIT_TYPE')}`, message)
}

createTrait.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      traits: Joi.object().keys({
        traitId: Joi.string().required(),
        data: Joi.array().required()
      })
    }).unknown(true).required()
  }).required()
}

/**
 * Update trait message in Elasticsearch.
 * @param {Object} message the message
 */
function * updateTrait (message) {
  yield update(`${message.payload.userId}${message.payload.traits.traitId}`, `${config.get('esConfig.ES_PROFILE_TRAIT_TYPE')}`, message)
}

updateTrait.schema = createTrait.schema

/**
 * Remove trait message in Elasticsearch.
 * @param {Object} message the message
 */
function * removeTrait (message) {
  yield remove(_.map(message.payload.memberProfileTraitIds, (traitId) =>
    `${message.payload.userId}${traitId}`), `${config.get('esConfig.ES_PROFILE_TRAIT_TYPE')}`)
}

removeTrait.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      memberProfileTraitIds: Joi.array().items().min(1).required(),
      updatedBy: Joi.string(),
      updatedAt: Joi.string()
    }).required()
  }).required()
}

/**
 * Create photo message in Elasticsearch.
 * @param {Object} message the message
 */
function * createPhoto (message) {
  //yield update(`${message.payload.userId}`, `${config.get('esConfig.ES_PROFILE_TYPE')}`, message)
  //yield create(`${PROFILE_RESOURCE}${message.payload.userId}${PHOTO_RESOURCE}`, message)
}

createPhoto.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      photoURL: Joi.string().uri().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Update photo message in Elasticsearch.
 * @param {Object} message the message
 */
function * updatePhoto (message) {
  //message.payload.resource = PHOTO_RESOURCE
  //yield update(`${PROFILE_RESOURCE}${message.payload.userId}${PHOTO_RESOURCE}`, message)
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