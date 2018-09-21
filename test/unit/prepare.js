/*
 * Setting up Mock for tests
 */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const nock = require('nock')
const prepare = require('mocha-prepare')
const {
  profileId,
  createProfileMessage,
  updateProfileMessage,
  traitId,
  createTraitMessage,
  updateTraitMessage,
  photoId,
  createPhotoMessage,
  updatePhotoMessage
} = require('../common/testData')
const { PROFILE_RESOURCE, TRAIT_RESOURCE, PHOTO_RESOURCE } = require('../../src/constants')
const testHelper = require('../common/testHelper')

const ops = ['_create', '_update'] // ES operations
const ids = [profileId, traitId, photoId]

let profile
let trait
let photo

prepare(function (done) {
  // called before loading of test cases
  nock(/.com|localhost/)
    .persist()
    .filteringPath((path) => {
      const parts = path.split('/')
      const op = parts.pop()
      const id = parts.pop()
      if (op === '_source') { // For GET operation
        return id
      } else if (ops.indexOf(op) !== -1 && ids.indexOf(id) !== -1) { // For Create & Update
        return id + '/' + op
      } else if (ids.indexOf(op) !== -1) { // For Delete
        return op
      }
      return op
    })
    .get(profileId)
    .query(true)
    .reply(() => {
      if (profile) {
        return [200, profile]
      } else {
        return [404, '']
      }
    })
    .post(`${profileId}/_create`)
    .query(true)
    .reply(() => {
      if (profile) {
        return [409, '']
      } else {
        profile = testHelper.mergeObj(createProfileMessage.payload, { resource: PROFILE_RESOURCE })
        return [200]
      }
    })
    .post(`${profileId}/_update`)
    .query(true)
    .reply(() => {
      profile = testHelper.mergeObj(updateProfileMessage.payload, { resource: PROFILE_RESOURCE })
      return [200]
    })
    .delete(profileId)
    .query(true)
    .reply(() => {
      if (profile) {
        profile = null
        return [200]
      } else {
        return [404, '']
      }
    })
    .get(traitId)
    .query(true)
    .reply(() => {
      if (trait) {
        return [200, trait]
      } else {
        return [404, '']
      }
    })
    .post(`${traitId}/_create`)
    .query(true)
    .reply(() => {
      if (trait) {
        return [409, '']
      } else {
        trait = testHelper.mergeObj(createTraitMessage.payload, { resource: TRAIT_RESOURCE })
        return [200, trait]
      }
    })
    .post(`${traitId}/_update`)
    .query(true)
    .reply(() => {
      trait = testHelper.mergeObj(updateTraitMessage.payload, { resource: TRAIT_RESOURCE })
      return [200, trait]
    })
    .delete(traitId)
    .query(true)
    .reply(() => {
      if (trait) {
        trait = null
        return [200]
      } else {
        return [404, '']
      }
    })
    .get(photoId)
    .query(true)
    .reply(() => {
      if (photo) {
        return [200, photo]
      } else {
        return [404, '']
      }
    })
    .post(`${photoId}/_create`)
    .query(true)
    .reply(() => {
      if (photo) {
        return [409, '']
      } else {
        photo = testHelper.mergeObj(createPhotoMessage.payload, { resource: PHOTO_RESOURCE })
        return [200, photo]
      }
    })
    .post(`${photoId}/_update`)
    .query(true)
    .reply(() => {
      photo = testHelper.mergeObj(updatePhotoMessage.payload, { resource: PHOTO_RESOURCE })
      return [200, photo]
    })
    .get(() => true)
    .query(true)
    .reply(404)
    .post(() => true)
    .query(true)
    .reply(404)
    .delete(() => true)
    .query(true)
    .reply(404)
  done()
}, function (done) {
  // called after all test completes (regardless of errors)
  nock.cleanAll()
  done()
})
