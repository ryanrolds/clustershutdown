
var fs = require('fs')
var harness = require('./harness')

var filename = './sigint.output'

harness(filename, function(workers) {
  var file = fs.openSync(filename, 'a')
  fs.writeSync(file, 'Master: SIGINT\n')

  process.kill(process.pid, 'SIGINT')
  setTimeout(function() {
    // Never called
    fs.writeSync(file, 'Master: Exiting\n')
    fs.closeSync(file)

    process.exit(0)
  }, 0)
})
