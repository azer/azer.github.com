(function(ns){

  ns.assert = function(arg1,arg2){
    if(arg1!=arg2)
      throw Error('Assertion Error');
  }

  ns.partial=function(fn,scope){
    var fn = fn, scope = scope||window, args = Array.prototype.slice.call(arguments,2);
    return function(){
        return fn.apply(scope,args.concat( Array.prototype.slice.call(arguments,0) ));
    }
  };

})( typeof MODULE_NS != 'undefined' && MODULE_NS || window  );
