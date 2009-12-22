/**
 * Module Management Mechanism
 *
 * Usage Example:
 * >>> m('m.core.utils','m.dom.xslt','jquery');
 * >>> var EventManager = m('m.core.event_manager').EventManager;
 *
 */
(function(){
  
  /**
   * 
   */
  window.m = function(module_name){
    if(arguments.length==1){
      return import_module(module_name);
    }

    for(var i=0,len=arguments.length; i<len; i++){
      import_module( arguments[i] );
    }

  }
  
  /**
   * Essential elements of the Module Management Mechanism.
   */
  var current_dir = ""; // TODO: current dir should be detected from source code or given by user. 
  var module_cache = {};

  /**
   * Executes given sourcecode in a wrapper function.
   * @param module
   */
  var compile_module = function(module){
    var wrapper = new Function('MODULE_NS',module._source_); 
    wrapper.call(window,module);
  };

  /**
   * Find URI of given module name
   * @param name
   */
  var resolve_module_path = function(name){
    return current_dir+name.replace(/\./g,'/')+'.js';
  };

  /**
   * Import source of given module, synchronously
   */
  var load_source = function(path){
    var req = new XMLHttpRequest();
    req.open('GET',path,false);
    req.send();
    if(req.status!=200){
      throw Error('Could not import '+path);
    }
    return req.responseText;
  }

  /**
   * Load modules by given names
   */
  var load_module = function(name){
    var 
      path = resolve_module_path(name),
      module = { '_uri_':path, '_name_':name, '_source_':load_source(path) }
    ;
    try {
      compile_module( module ); 
    } catch(error){
      throw Error('Could not load module '+name);
    }
    return module;
  };

  /**
   * import_module
   */
  var import_module = function(name){

    // load module
    if(!module_cache[name]){
      module_cache[name] = load_module(name);
    }
    
    // init package namespaces if needed
    var module_name = name.match(/([\w+\-]+)$/)[1];
    var packages = module_cache[name]._uri_.replace(module_name+'.js','').trim().split('/'),
    parent_pkg = window;
    for(var i=0,len=packages.length; i<len; i++){
      var package_name = packages[i];
      if(!package_name)
        break;
      if(!parent_pkg[ package_name ]){
        var pkg={ '_name_':package_name, '_uri_':'' };
        parent_pkg[ package_name ] = pkg; 
      }
      parent_pkg = parent_pkg[ package_name ];
    }

    // assign to parent package
    parent_pkg[module_name] = module_cache[name];

    return module_cache[name];
  }

})();
