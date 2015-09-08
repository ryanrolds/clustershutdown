
var fs = require('fs')
var cluster = require('cluster')
var harness = require('./harness')

var filename = './disconnect.output'

harness(filename, function(workers) {
  var file = fs.openSync(filename, 'a')
  fs.writeSync(file, 'Master: Disconnecting\n')

  cluster.disconnect(function() {
    fs.writeSync(file, 'Master: Exiting\n')
    fs.closeSync(file)
    process.exit(0)
  })
})
