!function() {

  'use strict';

  function Relief( requireContext, runnerContextName ){
    if ( !requireContext ) throw new Error( 'no require context passed!' )
    if ( runnerContextName ) {
      if ( typeof requireContext.s.contexts[ runnerContextName ] !== 'object' )
        throw new Error( 'your runner context does not exist!' )
      this.rootContextName = runnerContextName
    } else this.rootContextName = '_'
    this.loader = requireContext
    var contextName = generateRandContextName( requireContext.s.contexts )
    this.contextName = contextName
    this.loader.s.contexts[ contextName ] =
      requireContext.s.newContext( contextName )
    this.actuals = {}
    this.stubs = {}
  }

  Relief.prototype = {
    inject: function( depPath, substitution ) {
      if ( arguments.length === 1 && typeof depPath !== 'object' )
        throw new Error( 'passing one argument to inject requires the arg ' +
            'to be an object!' )
      if ( arguments.length === 2 && typeof depPath !== 'string' )
        throw new Error( 'depPath must be a string when called with 2 args! ' )
      console.log( this.loader.s.contexts )
      var stubs = this.stubs
        , thisContextDefined =
            this.loader.s.contexts[ this.contextName ].defined
        , rootContextDefined =
            this.loader.s.contexts[ this.rootContextName].defined
        , substitutions
        , sub
        , definedModule

      if ( typeof depPath === 'string' ) {
        substitutions = {}
        substitutions[ depPath ] = substitution
      } else substitutions = depPath

      for ( sub in substitutions ) {
        if ( !substitutions.hasOwnProperty( sub ) ) continue
        definedModule = thisContextDefined[ sub ] || rootContextDefined[ sub ]
        if ( definedModule )
          this.actuals[ sub ] = definedModule
        thisContextDefined[ sub ] = substitutions[ sub ]
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
