
var fs = require('fs')
var async = require('async')
var harness = require('./harness')

var filename = './poison_pill.output'

harness(filename, function(workers) {
  var file = fs.openSync(filename, 'a')
  fs.writeSync(file, 'Master: Sending pills\n')
  
  async.forEach(workers, function(worker, callback) {
    worker.on('exit', function() {
      fs.writeSync(file, 'Master: pill exit\n')
      return callback()
    })
      
    worker.send('pill')
  }, function() {
    fs.closeSync(file)
    process.exit(0)
  })
})
