Relief
====

Dependency injection for RequireJS.

## API

```
define( [ 'path/to/relief' ], function( relief ) {
  var loader = relief()
});
```

## relief( [,requireObject] [,contextName])

Returns a new `Relief` object, with `window.require` as its loader if no params
 are passed.

If you don't expose a global `require` function or have moved it elsewhere,
 pass the require Object as the first parameter.
 
If you pass a `contextName` parameter, Relief will include that context and its configuration (baseUrl, shim, etc ) when looking up modules. If it is not used, Relief will just delegate to RequireJS's regular context( `_` ) and its config.

### stub()/inject()

`stub` and `inject` register a stub to inject for a dependency when `load` is called.

You can call `stub` or `inject` with two arguments:

`loader.stub( 'thingIWantToStub', sinon.stub() )`

or, for convenience, only pass the first argument as an object for stubbing multiple dependencies at once:

```
loader.stub(
  {
    'jquery': someJqueryReplacement
  , 'backbone': someBackboneReplacement
  }
)
```

### unstub()/uninject()

Removes a stub from being loaded before `load` is called. Takes the same type of arguments as `stub/inject`

### copy()

Creates a new instance of `Relief` by copying an instance of relief. It will copy the config and any stubs/actuals defined on the object.

`var loader2 = relief.copy()`

### load()

Relief will inject all of the stubs when you call `load`. You can use it like you would normally use the AMD format of requiring modules:

```
loader.load( ['dep1'], function( dep1, relief ) {
	// do your stuff here
})
```

The `load` functions always passes back the same instance of `relief` **as the last argument**. The `relief` object will give you access to the `stubs`, and any actuals Relief was able to find. You can use the `stubs` object to set up and tear down your mocks and spies.

Here's an example using Mocha as the test framework, Chai as the assertion framework, and Sinon/chai-sinon for stubbing:

```
loader.stub( 'jquery', sinon.stub() )
loader( [ 'somethingThatDepsOnJquery' ], function( thingBeingTested, _relief) )
  beforeEach( function() {
    _relief.stubs.jquery.reset()
  })
  
  it( 'creates some jQuery object', function() {
    expect( _relief.stubs.jquery ).to.have.been.calledWith( '#divThingy' )
  })
})
```


