/* ഓം ബ്രഹ്മാർപ്പണം. */

angular.module( 'asf.bs-extra', ['ui.select'] )
  .service( 'bseDataSource', function(){
    var sources = {};
    this.addSource = function( name, fn ){
      sources[name] = fn;
    };

    this.search = function ( ref, str ){
      var searchFn = sources.default;
      if( ref && ref.searchFn ){
        searchFn = sources[ref.sourceFn];
        if( !searchFn ){
          throw new Error('asf-bs-extra: Search function '+ref.searchFn+' is not registered' );
        }
      }
      return searchFn( ref, str );
    };
  })
  .controller( 'typeaheadCtrl', [ '$scope', 'bseDataSource', '$interpolate', function( $scope, bseDataSource, $interpolate ){
    var functionCache = {};
    $scope.search = bseDataSource.search;
    $scope.getVal = function( item, prop ){
      if( prop === undefined ){ return item; }
      if( !functionCache[prop] ){
        functionCache[prop] = $interpolate( prop );
      }
      return functionCache[prop](item);
    };

  }]);

angular.module('asf.bs-extra').config(
  ['schemaFormDecoratorsProvider', 'sfBuilderProvider',
    function (schemaFormDecoratorsProvider, sfBuilderProvider ) {
      schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'bse:select',
        'asf-bs-extra/select.html',
        sfBuilderProvider.stdBuilders
      );
      schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'bse:typeahead',
        'asf-bs-extra/typeahead.html',
        sfBuilderProvider.stdBuilders
      );
    }]);

