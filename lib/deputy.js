!function() {

  function relief( requireContext ){
    return relief.prototype.init.call(function(){}, requireContext )
  }

  relief.prototype = {
    init: function( requireContext ) {
      if ( !requireContext && arguments.callee !== this ) throw new Error( 'no require context passed!' )
      this.loader = requireContext
      this.actuals = {}
      return this
    }
  , inject: function( depPath, substitution ) {
      var loadedDeps = this.loader.s.contexts._.defined
        if ( loadedDeps[ depPath ] ) {
          this.actuals[ depPath ] = loadedDeps[ depPath ]
        }
      loadedDeps[ depPath ] = substitution
      return this
    }
  }

  if ( typeof define === 'function' && define.amd !== undefined ) {
    define( function(){ return relief } )
  }

}();
