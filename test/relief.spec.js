define( function( require ) {

  describe( 'Relief', function(){

    var Relief, requireJS, that, jqueryStub

    beforeEach( function() {

      Relief = require( 'relief' )
      oldJqueryStub = { works: 'false' }
      jqueryStub = { works: true }
      requireJS = {}
      that = {
        loader: requireJS
      , actuals: {}
      }
      requireJS.s = {
        contexts: {
          _: {
            defined: {
              'jquery': oldJqueryStub
            }
          }
        }
      , apply: sinon.stub()
      }
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

      it( 'creates a random context name', function() {
        expect( new Relief( requireJS ) ).to.have.ownProperty( 'contextName' )
      })

    })

    describe( 'dependency injection', function() {

      describe( 'when passed two args', function() {

        beforeEach( function() {
          this.result = Relief.prototype.inject.call( that, 'jquery', jqueryStub )
        })

        it( 'saves an old copy of loaded dependencies', function(){
          expect( that.actuals.jquery )
           .to.equal( oldJqueryStub )
        })

        it( 'replaces the old loaded dependency', function() {
          expect( that.loader.s.contexts._.defined.jquery )
            .to.equal( jqueryStub )
        })

        it( 'returns the Relief object', function() {
          expect( this.result ).to.equal( that )
        })

      })

      describe( 'when passed 1 arg', function() {

        beforeEach( function() {
          this.result = Relief.prototype.inject.call( that,
            { jquery: jqueryStub } )
        })

        it( 'throw an err if argument is not an object', function() {
          expect( function() { Relief.prototype.inject.call( that, 'bang' ) } )
            .to.throw()
        })

        it( 'saves an old copy of loaded dependencies', function(){
          expect( that.actuals.jquery )
           .to.equal( oldJqueryStub )
        })

        it( 'replaces the old loaded dependency', function() {
          expect( that.loader.s.contexts._.defined.jquery )
            .to.equal( jqueryStub )
        })

        it( 'returns the Relief object', function() {
          expect( this.result ).to.equal( that )
        })

      })


    })
  })

});
