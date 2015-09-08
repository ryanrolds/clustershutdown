
var cluster = require('cluster')
var fs = require('fs')

var async = require('async')

module.exports = function(filename, shutdown) {
  if (cluster.isMaster) {
    // Truncate file
    var file = fs.openSync(filename, 'w+')
    fs.closeSync(file)

    file = fs.openSync(filename, 'a')

    fs.writeSync(file, 'Forking\n')
    var workers = []

    for  (var i = 0; i < 10; i++) {
      worker = cluster.fork()
      workers.push(worker)

      worker.on('exit', function() {
	fs.writeSync(file, 'Master: worker exit\n')
      })
    }

    process.on('exit', function() {
      fs.writeSync(file, 'Master exit\n')
      fs.closeSync(file)
    })
    
    setTimeout(function() {
      shutdown(workers)
    }, 2000)
  } else if (cluster.isWorker) {
    var file = fs.openSync(filename, 'a')
    fs.writeSync(file, 'Worker: Starting\n')

    process.on('message', function(msg) {
      fs.writeSync(file, 'Worker: message - ' + msg + '\n') 

      if (msg === 'pill') {
	process.exit(0)
      }
    })

    process.on('disconnect', function() {
      fs.writeSync(file, 'Worker: disconnect\n')
    })

    process.on('exit', function() {
      fs.writeSync(file, 'Worker: exit\n')
    })
  }
}
