
# Cluster shutdown examples

## SIGINT

The exit code (130) and lack of "Master exit" event is concerning.

    $ node sigint.js
    
    $ echo $?
    130
    $ cat sigint.output 
    Forking
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Master: SIGINT
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit

## process.exit(0)

This calls the masters exit handler and worker exit handlers, but doesn't fire master's worker exit handlers.

    $ node exit.js
    $ echo $?
    0
    $ cat exit.output 
    Forking
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Master: Exiting
    Master exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: exit

## cluster.disconnect()

This is from the Node.js docs. Everything almost fires as expected (one master worker event is missing, sometimes). Aside from what I suspect is a bug/race condition in Node.js (will investigate on my own time) this exits in an orderly fashion. The racecondition could posisbly be worked around by invoking diconnect on each worker rather then using cluster.disconnect(). 

    $ node disconnect.js
    $ echo $?
    0
    $ cat disconnect.output 
    Forking
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Master: Disconnecting
    Worker: disconnect
    Worker: disconnect
    Worker: disconnect
    Worker: disconnect
    Worker: disconnect
    Worker: disconnect
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: disconnect
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: disconnect
    Worker: exit
    Worker: exit
    Master: worker exit
    Master: worker exit
    Master: worker exit
    Master: worker exit
    Master: worker exit
    Master: worker exit
    Master: worker exit
    Worker: disconnect
    Worker: exit
    Master: worker exit
    Worker: disconnect
    Worker: exit
    Master: worker exit
    Master: Exiting
    Master exit

## Poison pill

This approach has the workers exit themselves in an orderly fashion. Commonly used in C/C++ programs.

    $ node poison_pill.js
    $ echo $?
    0
    $ cat poison_pill.output 
    Forking
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Worker: Starting
    Master: Sending pills
    Worker: message - pill
    Worker: message - pill
    Worker: exit
    Worker: message - pill
    Worker: message - pill
    Worker: message - pill
    Worker: exit
    Worker: message - pill
    Worker: exit
    Worker: exit
    Worker: exit
    Worker: message - pill
    Worker: exit
    Worker: exit
    Worker: message - pill
    Worker: exit
    Worker: message - pill
    Worker: exit
    Master: worker exit
    Master: pill exit
    Worker: message - pill
    Master: worker exit
    Master: pill exit
    Worker: exit
    Master: worker exit
    Master: pill exit
    Master: worker exit
    Master: pill exit
    Master: worker exit
    Master: pill exit
    Master: worker exit
    Master: pill exit
    Master: worker exit
    Master: pill exit
    Master: worker exit
    Master: pill exit
    Master: worker exit
    Master: pill exit
    Master: worker exit
    Master: pill exit
    Master exit
