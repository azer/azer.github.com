var test_functions = function(){
  assert( assert ); // dummiest assert i've seen ever
  assert( compare );
  assert( log );
}

var test_dependencies = function(){
  assert( window.FOOBAR );
  assert( window.SUPERTRAMP );
}

var test_fail= function(){
  assert(false);
}

var test_error = function(){
  throw Error('One-two.. one-twoo..');
}
