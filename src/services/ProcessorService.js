/**
 * Service for member processor.
 */
const _ = require('lodash')
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
  if (payload.createdAt && _.isNumber(payload.createdAt)) {
    payload.createdAt = new Date(payload.createdAt).toISOString()
  }
  if (payload.updatedAt && _.isNumber(payload.updatedAt)) {
    payload.updatedAt = new Date(payload.updatedAt).toISOString()
  }
  return payload
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
    body: convertPayload(message.payload)
  })
}

/**
 * Update message in Elasticsearch.
 * @param {String} id the Elasticsearch record id
 * @param {Object} message the message
 */
function * update (id, message) {
  convertPayload(message.payload)
  yield client.update({
    index: config.get('esConfig.ES_INDEX'),
    type: config.get('esConfig.ES_TYPE'),
    id,
    body: { upsert: message.payload, doc: message.payload }
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
  message.payload.resource = PROFILE_RESOURCE
  yield create(`${PROFILE_RESOURCE}${message.payload.userId}`, message)
}

createProfile.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      userHandle: Joi.string().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Update profile message in Elasticsearch.
 * @param {Object} message the message
 */
function * updateProfile (message) {
  message.payload.resource = PROFILE_RESOURCE
  yield update(`${PROFILE_RESOURCE}${message.payload.userId}`, message)
}

updateProfile.schema = createProfile.schema

/**
 * Remove profile message in Elasticsearch.
 * @param {Object} message the message
 */
function * removeProfile (message) {
  yield remove([`${PROFILE_RESOURCE}${message.payload.userId}`])
}

removeProfile.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      userHandle: Joi.string().required()
    }).required()
  }).required()
}

/**
 * Create trait message in Elasticsearch.
 * @param {Object} message the message
 */
function * createTrait (message) {
  message.payload.resource = TRAIT_RESOURCE
  yield create(`${PROFILE_RESOURCE}${message.payload.userId}${TRAIT_RESOURCE}${message.payload.traitId}`, message)
}

createTrait.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      userHandle: Joi.string().required(),
      traitId: Joi.string().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Update trait message in Elasticsearch.
 * @param {Object} message the message
 */
function * updateTrait (message) {
  message.payload.resource = TRAIT_RESOURCE
  yield update(`${PROFILE_RESOURCE}${message.payload.userId}${TRAIT_RESOURCE}${message.payload.traitId}`, message)
}

updateTrait.schema = createTrait.schema

/**
 * Remove trait message in Elasticsearch.
 * @param {Object} message the message
 */
function * removeTrait (message) {
  yield remove(_.map(message.payload.memberProfileTraitIds, (traitId) =>
    `${PROFILE_RESOURCE}${message.payload.userId}${TRAIT_RESOURCE}${traitId}`))
}

removeTrait.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      userHandle: Joi.string().required(),
      memberProfileTraitIds: Joi.array().items(Joi.number().integer().min(1).required()).min(1).required()
    }).required()
  }).required()
}

/**
 * Create photo message in Elasticsearch.
 * @param {Object} message the message
 */
function * createPhoto (message) {
  message.payload.resource = PHOTO_RESOURCE
  yield create(`${PROFILE_RESOURCE}${message.payload.userId}${PHOTO_RESOURCE}`, message)
}

createPhoto.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      userHandle: Joi.string().required(),
      photoURL: Joi.string().uri().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Update photo message in Elasticsearch.
 * @param {Object} message the message
 */
function * updatePhoto (message) {
  message.payload.resource = PHOTO_RESOURCE
  yield update(`${PROFILE_RESOURCE}${message.payload.userId}${PHOTO_RESOURCE}`, message)
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
