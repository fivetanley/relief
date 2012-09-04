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
      , definedContext
      , rootContext = this.loader.s.contexts[ this.rootContextName ]
      , rootProp
      , rootConfig = rootContext.config
    this.contextName = contextName
    definedContext = this.loader.s.contexts[ contextName ] =
      requireContext.s.newContext( contextName )
    for ( rootProp in rootConfig ) {
      if ( ! rootConfig.hasOwnProperty( rootProp ) ) continue
      definedContext.config[ rootProp ] = rootConfig[ rootProp ]
    }
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
        this.stubs[ sub ] = substitutions[ sub ]
      }
      return this
    }
  , stub: function() {
      return this.inject.apply( this, arguments )
    }
  , uninject: function( stubName ) {
      delete this.stubs[ stubName ]
      return this
    }
  , unstub: function() {
      return this.uninject.apply( this, arguments )
    }
  , copy: function() {
      var copy = new Relief( this.loader )
        , stubs = this.stubs
        , stub

      for ( stub in stubs ) {
        if ( !stubs.hasOwnProperty( stub ) ) continue
        copy.inject( stub, stubs[ stub ] )
      }
      return copy
    }
  , load: function( deps, callback) {
      var stubs = this.stubs
        , stub
        , definedContext = this.loader.s.contexts[ this.contextName ].defined
        , req = this.loader.s.contexts[ this.contextName ].require
        , self = this
      deps.unshift( 'require' )
      for ( stub in stubs ) {
        if ( ! stubs.hasOwnProperty( stub ) ) continue
        definedContext[ stub ] = stubs[ stub ]
      }
      req.call( null, deps, function() {
        var args = Array.prototype.slice.call( arguments, 1 )
        args.push( self )
        callback.apply( null, args )
      })
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
