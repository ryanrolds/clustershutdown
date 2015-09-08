
var fs = require('fs')
var harness = require('./harness')

var filename = './exit.output'

harness(filename, function(workers) {
  var file = fs.openSync(filename, 'a')
  fs.writeSync(file, 'Master: Exiting\n')
  fs.closeSync(file)
  process.exit(0)
})
