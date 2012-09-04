!function() {

  function Relief( requireContext ){
    if ( !requireContext ) throw new Error( 'no require context passed!' )
    this.loader = requireContext
    this.contextName = generateRandContextName( this.loader.s.contexts )
    this.actuals = {}
  }

  Relief.prototype = {
    inject: function( depPath, substitution ) {
      if ( arguments.length === 1 && typeof depPath !== 'object' )
        throw new Error( 'passing one argument to inject requires the arg ' +
            'to be an object!' )
      if ( arguments.length === 2 && typeof depPath !== 'string' )
        throw new Error( 'depPath must be a string when called with 2 args! ' )
      var loadedDeps = this.loader.s.contexts._.defined
        , substitutions
        , sub

      if ( typeof depPath === 'string' ) {
        substitutions = {}
        substitutions[ depPath ] = substitution
      } else substitutions = depPath

      for ( sub in substitutions ) {
        if ( !substitutions.hasOwnProperty( sub ) ) continue
        if ( loadedDeps[ sub ] )
          this.actuals[ sub ] = loadedDeps[ sub ]
        loadedDeps[ sub ] = substitutions[ sub ]
      }
      return this
    }
  }

  function generateRandContextName( contexts ) {
    var randID = Math.random().toString( 36 ).substring( 9 )
    if ( contexts[ randID ] ) return generateRandContextName( contexts )
    return randID
  }

  if ( typeof define === 'function' && define.amd !== undefined ) {
    define( function(){ return Relief } )
  }

}();
