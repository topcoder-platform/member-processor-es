/*
 * Test data to be used in tests
 */

const profileId = 'profile11'

const createProfileMessage = {
  topic: 'member.action.profile.create',
  originator: 'member-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    userHandle: 'handle',
    sex: 'male',
    email: 'email@test.com',
    created: '2018-02-03T00:00:00',
    createdBy: 'admin'
  }
}

const updateProfileMessage = {
  topic: 'member.action.profile.update',
  originator: 'member-api',
  timestamp: '2018-03-04T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    userHandle: 'handle',
    sex: 'female',
    email: 'updated@test.com',
    created: '2018-02-03T00:00:00',
    createdBy: 'admin',
    updated: '2018-03-04T00:00:00',
    updatedBy: 'admin2'
  }
}

const deleteProfileMessage = {
  topic: 'member.action.profile.delete',
  originator: 'member-api',
  timestamp: '2018-03-05T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    userHandle: 'handle'
  }
}

const traitId = 'profile11trait123'

const createTraitMessage = {
  topic: 'member.action.profile.trait.create',
  originator: 'member-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    userHandle: 'handle',
    traitId: 123,
    traitAttribute: 'value',
    created: '2018-02-03T00:00:00',
    createdBy: 'admin'
  }
}

const updateTraitMessage = {
  topic: 'member.action.profile.trait.update',
  originator: 'member-api',
  timestamp: '2018-02-04T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    userHandle: 'handle',
    traitId: 123,
    traitAttribute: 'updated',
    created: '2018-02-03T00:00:00',
    createdBy: 'admin',
    updated: '2018-02-04T00:00:00',
    updatedBy: 'admin2'
  }
}

const deleteTraitMessage = {
  topic: 'member.action.profile.trait.delete',
  originator: 'member-api',
  timestamp: '2018-02-05T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    userHandle: 'handle',
    memberProfileTraitIds: [123]
  }
}

const photoId = 'profile11photo'

const createPhotoMessage = {
  topic: 'member.action.profile.photo.create',
  originator: 'member-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    userHandle: 'handle',
    photoURL: 'http://test.com/abc.png',
    created: '2018-02-03T00:00:00',
    createdBy: 'admin'
  }
}

const updatePhotoMessage = {
  topic: 'member.action.profile.photo.update',
  originator: 'member-api',
  timestamp: '2018-02-04T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    userHandle: 'handle',
    photoURL: 'http://test.com/def.png',
    created: '2018-02-03T00:00:00',
    createdBy: 'admin',
    updated: '2018-02-04T00:00:00',
    updatedBy: 'admin2'
  }
}

module.exports = {
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
  TEST_TIMEOUT_MS: 10000
}
