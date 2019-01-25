/**
 * The test cases for TC member processor.
 */

const _ = require('lodash')
const expect = require('chai').expect
const ProcessorService = require('../../src/services/ProcessorService')
const co = require('co')
const testHelper = require('../common/testHelper')
const {
  profileId,
  createProfileMessage,
  updateProfileMessage,
  deleteProfileMessage,
  traitId,
  createTraitMessage,
  updateTraitMessage,
  deleteTraitMessage,
  photoId,
  createPhotoMessage,
  updatePhotoMessage,
  TEST_TIMEOUT_MS
} = require('../common/testData')
const { PROFILE_RESOURCE, TRAIT_RESOURCE, PHOTO_RESOURCE } = require('../../src/constants')

describe('TC Member Processor Tests', () => {
  it('create profile message', (done) => {
    co(function * () {
      yield ProcessorService.createProfile(createProfileMessage)
      const data = yield testHelper.getESData(createProfileMessage.payload.userId)
      testHelper.expectObject(data, createProfileMessage.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create profile message - already exists', (done) => {
    co(function * () {
      try {
        yield ProcessorService.createProfile(createProfileMessage)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(409)
        return
      }
      throw new Error('There should be conflict error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('update profile message', (done) => {
    co(function * () {
      yield ProcessorService.updateProfile(updateProfileMessage)
      const data = yield testHelper.getESData(updateProfileMessage.payload.userId)
      testHelper.expectObject(data, updateProfileMessage.payload)
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('delete profile message', (done) => {
    co(function * () {
      yield ProcessorService.removeProfile(deleteProfileMessage)
      try {
        yield testHelper.getESData(deleteProfileMessage.payload.userId)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('delete profile message - not found', (done) => {
    co(function * () {
      try {
        yield ProcessorService.removeProfile(deleteProfileMessage.payload.userId)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        //expect(err.statusCode).to.equal(404)
        return
      }
      throw new Error('There should be not found error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create profile message - invalid parameters, missing originator', (done) => {
    const message = _.cloneDeep(createProfileMessage)
    delete message.originator
    co(function * () {
      try {
        yield ProcessorService.createProfile(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create profile message - invalid parameters, wrong mime-type', (done) => {
    const message = _.cloneDeep(createProfileMessage)
    message['mime-type'] = 123
    co(function * () {
      try {
        yield ProcessorService.createProfile(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create profile message - invalid parameters, missing payload user id', (done) => {
    const message = _.cloneDeep(createProfileMessage)
    delete message.payload.userId
    co(function * () {
      try {
        yield ProcessorService.createProfile(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('update profile message - invalid parameters, missing payload', (done) => {
    const message = _.cloneDeep(updateProfileMessage)
    delete message.payload
    co(function * () {
      try {
        yield ProcessorService.updateProfile(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('update profile message - invalid parameters, invalid timestamp', (done) => {
    const message = _.cloneDeep(updateProfileMessage)
    message.timestamp = 'abc'
    co(function * () {
      try {
        yield ProcessorService.updateProfile(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('delete profile message - invalid parameters, invalid payload userId', (done) => {
    const message = _.cloneDeep(deleteProfileMessage)
    message.payload.userId = { test: 123 }
    co(function * () {
      try {
        yield ProcessorService.removeProfile(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('delete profile message - invalid parameters, invalid topic', (done) => {
    const message = _.cloneDeep(deleteProfileMessage)
    message.topic = [1, 2]
    co(function * () {
      try {
        yield ProcessorService.removeProfile(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create trait message - invalid parameters, missing originator', (done) => {
    const message = _.cloneDeep(createTraitMessage)
    delete message.originator
    co(function * () {
      try {
        yield ProcessorService.createTrait(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create trait message - invalid parameters, wrong mime-type', (done) => {
    const message = _.cloneDeep(createTraitMessage)
    message['mime-type'] = 123
    co(function * () {
      try {
        yield ProcessorService.createTrait(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('update trait message - invalid parameters, missing payload', (done) => {
    const message = _.cloneDeep(updateTraitMessage)
    delete message.payload
    co(function * () {
      try {
        yield ProcessorService.updateTrait(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('update trait message - invalid parameters, invalid timestamp', (done) => {
    const message = _.cloneDeep(updateTraitMessage)
    message.timestamp = 'abc'
    co(function * () {
      try {
        yield ProcessorService.updateTrait(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('delete trait message - invalid parameters, invalid payload userId', (done) => {
    const message = _.cloneDeep(deleteTraitMessage)
    message.payload.userId = { test: 123 }
    co(function * () {
      try {
        yield ProcessorService.removeTrait(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('delete trait message - invalid parameters, invalid topic', (done) => {
    const message = _.cloneDeep(deleteTraitMessage)
    message.topic = [1, 2]
    co(function * () {
      try {
        yield ProcessorService.removeTrait(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('delete trait message - invalid parameters, invalid trait id', (done) => {
    const message = _.cloneDeep(deleteTraitMessage)
    message.payload.membetProfileTraitIds = [0]
    co(function * () {
      try {
        yield ProcessorService.removeTrait(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create photo message - invalid parameters, missing originator', (done) => {
    const message = _.cloneDeep(createPhotoMessage)
    delete message.originator
    co(function * () {
      try {
        yield ProcessorService.createPhoto(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create photo message - invalid parameters, wrong mime-type', (done) => {
    const message = _.cloneDeep(createPhotoMessage)
    message['mime-type'] = 123
    co(function * () {
      try {
        yield ProcessorService.createPhoto(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('create photo message - invalid parameters, missing payload photoURL', (done) => {
    const message = _.cloneDeep(createPhotoMessage)
    delete message.payload.photoURL
    co(function * () {
      try {
        yield ProcessorService.createPhoto(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('update photo message - invalid parameters, missing payload', (done) => {
    const message = _.cloneDeep(updatePhotoMessage)
    delete message.payload
    co(function * () {
      try {
        yield ProcessorService.updatePhoto(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('update photo message - invalid parameters, missing payload photoURL', (done) => {
    const message = _.cloneDeep(updatePhotoMessage)
    delete message.payload.photoURL
    co(function * () {
      try {
        yield ProcessorService.updatePhoto(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)

  it('update photo message - invalid parameters, invalid payload photoURL', (done) => {
    const message = _.cloneDeep(updatePhotoMessage)
    message.payload.photoURL = 'abc.png'
    co(function * () {
      try {
        yield ProcessorService.updatePhoto(message)
      } catch (err) {
        expect(err).to.exist // eslint-disable-line
        expect(err.name).to.equal('ValidationError')
        return
      }
      throw new Error('There should be validation error.')
    })
      .then(() => done())
      .catch(done)
  }).timeout(TEST_TIMEOUT_MS)
})
