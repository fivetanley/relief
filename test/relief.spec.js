define( function( require ) {

  describe( 'relief', function(){

    var deputy, requireJS, that, jqueryStub

    beforeEach( function() {

      deputy = require( 'relief' )
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
        var deputizing = function(){ deputy() }
        expect( deputizing ).to.throw( /no require/ )
      })
      it( 'does not throw when invocated correctly', function(){
        var deputizing = function(){ deputy( requireJS ) }
        expect( deputizing ).not.to.throw()
      })
    })

    describe( 'dependency injection', function() {

      var result

      beforeEach( function() {
        result = deputy.prototype.inject.call( that, 'jquery', jqueryStub )
      })

      it( 'saves an old copy of loaded dependencies', function(){
        expect( that.actuals.jquery )
         .to.equal( oldJqueryStub )
      })

      it( 'replaces the old loaded dependency', function() {
        expect( that.loader.s.contexts._.defined.jquery )
          .to.equal( jqueryStub )
      })

      it( 'returns the deputy object', function() {
        expect( result ).to.equal( that )
      })

    })
  })

});
