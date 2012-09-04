define( function( require ) {

  'use strict';

  describe( 'Relief', function(){

    var Relief, requireJS, relief, jqueryStub, oldJqueryStub

    beforeEach( function() {
      Relief = require( 'relief' )
      oldJqueryStub = { works: 'false' }
      jqueryStub = { works: true }
      requireJS = window.require
      requireJS.s.contexts._.defined.jquery = oldJqueryStub
      relief = new Relief( requireJS )
    })

    it( 'just works', function() {
      expect( true ).to.equal( true )
    })

    describe( 'initialization', function() {
      it( 'throw if no require is passed', function() {
        var deputizing = function(){ new Relief() }
        expect( deputizing ).to.throw( /no require/ )
      })

      it( 'does not throw when invocated correctly', function(){
        var deputizing = function(){ new Relief( requireJS ) }
        expect( deputizing ).not.to.throw()
      })

      it( 'creates a context name', function() {
        expect( new Relief( requireJS ) ).to.have.ownProperty( 'contextName' )
      })

    })

    describe( 'dependency injection', function() {

      describe( 'when passed two args', function() {

        beforeEach( function() {
          this.result = relief.inject( 'jquery', jqueryStub )
        })

        it( 'saves an old copy of loaded dependencies', function(){
          expect( relief.actuals.jquery )
           .to.equal( oldJqueryStub )
        })

        it( 'saves a copy of the injected dependency', function() {
          expect( relief.stubs.jquery)
            .to.equal( jqueryStub )
        })

        it( 'returns the Relief object', function() {
          expect( this.result ).to.equal( relief )
        })

      })

      describe( 'when passed 1 arg', function() {

        beforeEach( function() {
          this.result = relief.inject( { jquery: jqueryStub } )
        })

        it( 'throw an err if argument is not an object', function() {
          expect( function() { Relief.prototype.inject.call( relief, 'bang' ) } )
            .to.throw()
        })

        it( 'saves an old copy of loaded dependencies', function(){
          expect( relief.actuals.jquery )
           .to.equal( oldJqueryStub )
        })

        it( 'saves a copy of the stub', function() {
          expect( relief.stubs.jquery)
            .to.equal( jqueryStub )
        })

        it( 'returns the Relief object', function() {
          expect( this.result ).to.equal( relief )
        })

      })

    })

    describe( 'copying a Relief object', function() {
      beforeEach( function() {
        relief.inject( 'jquery', jqueryStub  )
        this.copy = relief.copy()
      })

      it( 'gives a Relief object', function() {
        expect( this.copy ).to.be.instanceOf( Relief )
      })

      it( 'copies the loader', function() {
        expect( this.copy.loader ).to.equal( relief.loader )
      })

      it( 'creates a new object for the copy\'s stubs', function() {
        expect( this.copy.stubs ).not.to.equal( relief.stubs )
      })

      it('copies over all the stubs', function() {

        var copyStubs = this.copy.stubs
          , reliefStubs = relief.stubs
          , reliefStub

        for ( reliefStub in reliefStubs ) {
          if ( !reliefStubs.hasOwnProperty( reliefStub ) ) continue
          expect( copyStubs ).to.have.ownProperty( reliefStub )
        }
      })

    })

    describe( 'removing a stub', function() {

      var result

      beforeEach( function() {
        relief.stub( 'jquery', jqueryStub )
        result = relief.uninject( 'jquery' )
      })

      it( 'removes the stub', function() {
        expect( relief.stubs ).not.to.have.ownProperty( 'jquery' )
      })

      it( 'returns the Relief object ( this )', function() {
        expect( result ).to.equal( relief )
      })
    })

    describe( 'calling the loader', function() {

      var callback = sinon.stub()
        , deps = [ 'foo', 'bar', 'baz' ]
        , req

      beforeEach( function() {
        req = relief.loader.s.contexts[ relief.contextName ].require =
          sinon.stub().yields( 'foo', 'bar', 'baz' )
        relief.stub( 'oldjquery', oldJqueryStub )
        relief.stub( 'jquery', jqueryStub )
        relief.load( deps, callback )
      })

      it( 'should create all the stubs in the new context', function() {
        var stubs = relief.stubs
          , stub
          , definedContext =
              relief.loader.s.contexts[ relief.contextName ].defined
        console.log( definedContext )
        for ( stub in stubs ) {
          if ( ! stubs.hasOwnProperty( stub ) ) continue
          expect( definedContext ).to.have.ownProperty( stub )
        }
      })

      describe( 'calling the require function of context', function() {
        it( 'calls the fn with the dependency list', function() {
          expect( req ).to.have.been.calledWith( deps )
        })

        it( 'calls the callback with the deps + relief obj', function() {
          expect( callback ).to.have.been
            .calledWith( 'foo', 'bar', 'baz', relief )
        })
      })

    })

    describe( 'aliases', function() {

      beforeEach( function() {
        relief.inject = sinon.stub()
        relief.uninject = sinon.stub()
      })

      it( 'aliases stub to inject', function() {
        relief.stub( 'jquery', jqueryStub )
        expect( relief.inject ).to.have.been.calledWith( 'jquery', jqueryStub )
      })

      it( 'aliases unstub to uninject', function() {
        relief.unstub( 'jquery' )
        expect( relief.uninject ).to.have.been.calledWith( 'jquery' )
      })
    })

  })

});
