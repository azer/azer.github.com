log('hello world');

var test_worker = function(){
  assert( window.Worker );
}

var test_canvas = function(){
  assert( document.createElement('canvas').getContext );
}

var test_video  = function(){
  assert( typeof document.createElement('video').src !=undefined );
}

var test_audio = function(){
  assert( typeof document.createElement('audio').src != undefined );
}
