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
          expect( relief.loader.s.contexts[ relief.contextName ].defined.jquery)
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

        it( 'replaces the old loaded dependency', function() {
          expect( relief.loader.s.contexts[ relief.contextName ].defined.jquery)
            .to.equal( jqueryStub )
        })

        it( 'returns the Relief object', function() {
          expect( this.result ).to.equal( relief )
        })

      })

    })
  })

});
