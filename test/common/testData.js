/*
 * Test data to be used in tests
 */

const profileId = '11'

const createProfileMessage = {
  topic: 'member.action.profile.create',
  originator: 'member-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    sex: 'male',
    email: 'email@test.com',
    createdAt: '2018-02-03T00:00:00',
    createdBy: 'admin',
    updatedAt: '2018-03-04T00:00:00',
    updatedBy: 'admin2'
  }
}

const updateProfileMessage = {
  topic: 'member.action.profile.update',
  originator: 'member-api',
  timestamp: '2018-03-04T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11,
    sex: 'female',
    email: 'updated@test.com',
    createdAt: '2018-02-03T00:00:00',
    createdBy: 'admin',
    updatedAt: '2018-03-04T00:00:00',
    updatedBy: 'admin2'
  }
}

const deleteProfileMessage = {
  topic: 'member.action.profile.delete',
  originator: 'member-api',
  timestamp: '2018-03-05T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: 11
  }
}

const traitId = '123'

const createTraitMessage = {
  topic: 'member.action.profile.trait.create',
  originator: 'member-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: traitId,
    createdAt: '2018-02-03T00:00:00',
    createdBy: 'admin',
    updatedAt: '2018-03-04T00:00:00',
    updatedBy: 'admin2',
    'traits': [{
	  'traitId': 'device',
	  'data': [{
        'deviceType': 'Desktop',
        'manufacturer': 'Apple',
	    'model': 'MacBook Pro xx',
        'operatingSystem': 'MacOS',
        'osVersion': 'High Sierra 10.13.4',
        'osLanguage': 'English'
      }]
    }]
  }
}

const updateTraitMessage = {
  topic: 'member.action.profile.trait.update',
  originator: 'member-api',
  timestamp: '2018-02-04T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: traitId,
    updatedAt: '2018-03-04T00:00:00',
    updatedBy: 'admin2',
    'traits': [{
	  'traitId': 'device',
	  'data': [{
        'deviceType': 'Desktop',
        'manufacturer': 'Apple',
	    'model': 'MacBook Pro xx',
        'operatingSystem': 'MacOS',
        'osVersion': 'High Sierra 10.13.4',
        'osLanguage': 'English'
      }]
    }]
  }
}

const deleteTraitMessage = {
  topic: 'member.action.profile.trait.delete',
  originator: 'member-api',
  timestamp: '2018-02-05T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: traitId,
    memberProfileTraitIds: [123],
    updatedAt: '2018-03-04T00:00:00',
    updatedBy: 'admin2'
  }
}

const photoId = 1234

const createPhotoMessage = {
  topic: 'member.action.profile.photo.create',
  originator: 'member-api',
  timestamp: '2018-02-03T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: photoId,
    photoURL: 'http://test.com/abc.png',
    createdAt: '2018-02-03T00:00:00',
    createdBy: 'admin',
    updatedAt: '2018-02-04T00:00:00',
    updatedBy: 'admin2'
  }
}

const updatePhotoMessage = {
  topic: 'member.action.profile.photo.update',
  originator: 'member-api',
  timestamp: '2018-02-04T00:00:00',
  'mime-type': 'application/json',
  payload: {
    userId: photoId,
    photoURL: 'http://test.com/def.png',
    createdAt: '2018-02-03T00:00:00',
    createdBy: 'admin',
    updatedAt: '2018-02-04T00:00:00',
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
