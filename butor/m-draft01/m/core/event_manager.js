/*
 * EventManager
 * Provides Event-Driven Programming without DOM events on Javascript
 */

(function(ns){

  /*
   * Declaring
   */
  ns.EventManager = function(){
    
    var
      _eventslot_ = {}
    ;
    
    /*
     * Create listener new listener array on eventslot
     */

    this.create = function(event_name){
      _eventslot_[event_name] = [];
    }

    /*
     * Create and/or returns existing listener array by event name
     */
    this.get = function(event_name){
      if(!this.has(event_name))
        this.create(event_name);
      return _eventslot_[event_name];
    }
    
    /*
     * Test for presence of listener array in the slot
     */
    this.has = function(event_name){
      return _eventslot_[event_name]&&true||false;
    }

    /*
     * Return file of given function in eventslot array.
     */

    this.index = function(event_name,fn){
      if(!this.has(event_name)){
        throw Error("Given event name does not exist.")
      }
      return this.get(event_name).indexOf(fn);
    }

    /*
     * Add new listener
     */
    this.add_listener = function(event_name,fn){
      this.get(event_name).push(fn);
    }
    
    /*
     * Check for presence of listener in eventslot
     */
    this.has_listener = function(event_name,fn){
      return this.index(event_name,fn)>-1;
    }

    /*
     * Remove existing listener
     */
    this.remove_listener = function(event_name,fn){
      var
        index = this.index(event_name,fn),
        cur_array = this.get(event_name),
        new_array = cur_array.slice(0,index)
      ;
      Array.prototype.push.apply(new_array,cur_array.slice(index+1));
      _eventslot_[event_name] = new_array;
    }

    /*
     * Execute functions on eventslot by given event name
     */
    this.fire = function(event_name){
      var
        listeners = this.get(event_name)
      ;
      for(var i=0,len=listeners.length; i<len; i++){
        listeners[i].apply(window,Array.prototype.slice.call(arguments,1));
      }
    }

  }

})( typeof MODULE_NS !='undefined' && MODULE_NS || window );
