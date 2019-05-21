class MockImage {
  constructor(valid) {
    this.getBuffer = jest.fn().mockImplementation((mimeType, callback) => {
      if (valid) {
        callback('mock-buffer')
      } 
      throw 'unable to read data from jimp image'
    })
  }
}

const jimp = {
  canRead: true,
  canGetBuffer: true,
  read: buffer => {
    jimp.promise = new Promise(resolve => {
        if (jimp.canRead) {
          return new MockImage(jimp.canGetBuffer)
        } else {
          throw 'unable to read WMS image data'
        }
    }, reject)
    console.warn(jimp.promise);
    
    return jimp.promise
  }
}

module.exports = jimp
