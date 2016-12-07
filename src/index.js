/* ഓം ബ്രഹ്മാർപ്പണം. */

angular.module( 'asf.bs-extra', ['ui.select', 'ui.bootstrap.datetimepicker', 'ngFileUpload', 'ngImgCrop' ] )
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
    $scope.optionsData = [];
    function fillArr( arr, items ){
      arr.splice(0);
      items.forEach( function(v){ arr.push(v); });
    }
    $scope.search = function(ref, str ){
      if( $scope.form.isAsync ){
        bseDataSource.search( ref, str ).then( function( items ){
          fillArr( $scope.optionsData, items );
        });
      } else {
        fillArr( $scope.optionsData, bseDataSource.search( ref, str ) );
      }
    };

    $scope.getVal = function( item, prop ){
      if( prop === undefined ){ return item; }
      if( !functionCache[prop] ){
        functionCache[prop] = $interpolate( prop );
      }
      return functionCache[prop](item);
    };
  }])
  .directive( 'bseFileupload', [ 'Upload', function( Upload ){
    return {
      restrict: 'A',
      scope:    true,
      require:  'ngModel',
      link:     function (scope, element, attrs, ngModel) {
        scope.modelObj = scope.model;
        scope.fieldName = scope.form.key[0];
        scope.picFile = null;
        scope._state = scope.modelObj? 'loaded' : 'empty';
        scope.$watch( 'picFile', function( newVal, old, scope ){
          if( newVal ){
            scope._state = 'changed';
          }
        });

        scope.upload = function (dataUrl, name) {
          Upload.upload({
            url: '/upload?group=' + scope.form.groupName,
            data: {
              file: Upload.dataUrltoBlob(dataUrl, name)
            },
          }).then(function (response) {
            scope.model[scope.fieldName] = response.data[0];
            scope._state = 'loaded';
          }, function (response) {
            if (response.status > 0) scope.errorMsg = response.status + ': ' + response.data;
          }, function (evt) {
            scope.progress = parseInt(100.0 * evt.loaded / evt.total);
          });
        };

      }
    };
  } ]);

angular.module('asf.bs-extra').config(
  ['schemaFormDecoratorsProvider', 'sfBuilderProvider', 'schemaFormProvider', 'sfPathProvider',
    function (schemaFormDecoratorsProvider, sfBuilderProvider, schemaFormProvider, sfPathProvider ) {

      schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'bse:multiselect',
        'asf-bs-extra/multi-select.html',
        sfBuilderProvider.stdBuilders
      );
      schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'bse:select',
        'asf-bs-extra/select.html',
        sfBuilderProvider.stdBuilders
      );
      schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'bse:datetime',
        'asf-bs-extra/datetime.html',
        sfBuilderProvider.stdBuilders
      );
      schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'bse:fileupload',
        'asf-bs-extra/fileupload.html',
        sfBuilderProvider.stdBuilders
      );
      schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'bse:typeahead',
        'asf-bs-extra/typeahead.html',
        sfBuilderProvider.stdBuilders
      );
    }]);

