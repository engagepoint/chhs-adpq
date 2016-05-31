'use strict';

angular.module('apqdApp')
    .service('CWSSearchService', ['$log', '$injector', '$q', 'ElasticSearchStringQueryBuilder',
        function ($log, $injector, $q, ElasticSearchStringQueryBuilder) {

            /**
             * Example 1:
             *      CWSSearchService.searchEntity(ReferralSearch, stringQuery, resultsCallback);
             * Example 2:
             *      CWSSearchService.searchEntity(
             *          UserSearch,
             *          ElasticSearchStringQueryBuilder.newInstance().buildStringQuery(searchString),
             *          function (results) {
             *              $scope.users = results;
             *          }
             *      );
             *
             * @param EntitySearchService - search service generated by jhipster for an entity (like ReferralSearch)
             * @param stringQuery - Elasticsearch String Query (having specific syntax); Search will not be executed if it's empty.
             * @param resultsCallback
             * @param errorCallback
             * @return search service query() method promise or null if nothing to search
             */
            this.searchEntity = function (EntitySearchService, stringQuery, resultsCallback, errorCallback) {
                if (stringQuery.length > 0) {
                    return EntitySearchService.query(
                        {query: stringQuery},
                        angular.isFunction(resultsCallback) ? resultsCallback : function () {},
                        angular.isFunction(errorCallback) ? errorCallback : function (response) {
                            // response.status === 404
                            $log.error('searchEntity failed: ' + response.data);
                        }).$promise;
                }
                return null;
            };

            // assume that arrays doesn't come here but scalars or objects only (due to previous processing, as coded)
            function _normalizeSearchClause(searchClause) {
                if (_.isNil(searchClause)) { // if null or undefined
                    searchClause = '';
                }

                if (angular.isString(searchClause) || angular.isNumber(searchClause)) {
                    searchClause = {
                        searchString: searchClause
                    };
                }

                // Transform { 'name': 'John' } into { field: 'name', searchString: 'John' }
                //  while keeping { 'searchString': 'John' } as is.
                if (_.keys(searchClause).length === 1 && angular.isUndefined(searchClause.searchString)) {
                    searchClause = {
                        field: _.keys(searchClause)[0],
                        searchString: _.values(searchClause)[0]
                    };
                }

                // Convert number to string.
                // _.toString is good because makes '' from null and undefined
                searchClause.searchString = _.toString(searchClause.searchString);

                return searchClause;
            }

            // At least, one search clause with qualified data has to exist. Otherwise, no search will run at all.
            // But sometimes, it's may be not enough to run search if certain clauses have qualified data and others haven't.
            // For example, if we need to filter out a record with given id,
            //  but we don't want to receive all records except that one if other clauses (like firstName) are not qualified.
            // In this example, the id related search clause is insufficient.
            // Apply 'insufficient: true' option to clauses that should not be searched if all other sufficient clauses are not qualified.
            // Search clauses are counted as sufficient by default.
            function _buildStringQuery(searchClause) {
                if (angular.isArray(searchClause)) {
                    var sufficient = false;

                    var stringQueryArray = _.map(searchClause, function (clause) {
                        // yes, this one is recursive
                        var query = _buildStringQuery(clause);

                        sufficient = sufficient || ((_.isNil(clause.insufficient) || !clause.insufficient) && query);

                        return query;
                    });

                    return !sufficient ? '' :
                        _(stringQueryArray).omitBy(_.isEmpty).map(function (stringQuery) {
                            return '(' + stringQuery + ')'
                        }).value().join(' AND ');

                } else {

                    if (_.isObject(searchClause) && !_.isNil(searchClause.nativeQuery)) {
                        return searchClause.nativeQuery;
                    }

                    searchClause = _normalizeSearchClause(searchClause);

                    var queryBuilder = ElasticSearchStringQueryBuilder.newInstance();

                    if (angular.isDefined(searchClause.minTokenLength)) {
                        queryBuilder.minTokenLength(searchClause.minTokenLength);
                    }

                    if (searchClause.matchExactWord) {
                        queryBuilder.matchExactWord();
                    }

                    if (angular.isString(searchClause.field)) {
                        queryBuilder.searchByField(searchClause.field);
                    }

                    if (angular.isString(searchClause.combine)) {
                        queryBuilder.combineWith(searchClause.combine);
                    }

                    if (angular.isDefined(searchClause.fuzziness)) {
                        queryBuilder.fuzziness(searchClause.fuzziness);
                    }

                    if (angular.isDefined(searchClause.detectId)) {
                        queryBuilder.detectId(searchClause.detectId);
                    }

                    if (angular.isDefined(searchClause.detectRecordStatus)) {
                        queryBuilder.detectRecordStatus(searchClause.detectRecordStatus);
                    }

                    return queryBuilder.buildStringQuery(searchClause.searchString);
                }
            }

            /**
             * Example 1:
             *  CWSSearchService.search($scope.searchString, {
             *      'Referral' : {
             *          onResponse: function (results) {
             *              $scope.referrals = results;
             *          },
             *          onError: function (response) {
             *              // if (response.status === 404) ...
             *              $scope.referrals = [];
             *          }
             *      }
             *  }).then(
             *      function () {
             *          $log.info('All search tasks complete.');
             *      }
             *  );
             *
             * Example 2:
             *  CWSSearchService.search(
             *      {
             *          searchString: $scope.searchString,
             *          field: 'middleName',
             *          combine: 'AND',
             *          fuzziness: 1
             *      },
             *      {
             *          'Client' : {
             *              onResponse: function (results) { $scope.clients = results; }
             *          }
             *      }
             *  );
             *
             * Example 3a:
             *  CWSSearchService.search(
             *      {
             *          searchString: client_id,
             *          field: 'id',
             *          minTokenLength: 1,
             *          matchExactWord: true // if you use "matchExactWord: false" - it will change nothing (same as you don't use it at all)
             *      },
             *      'Client'
             *  ).then(function(results) {
             *      $scope.clients = results.Client;
             *  });
             *
             * Example 3b (same functionality as 3a but using simplified syntax):
             *  CWSSearchService.search(
             *      {
             *          'id': client_id
             *      },
             *      'Client'
             *  ).then(function(results) {
             *      $scope.clients = results.Client;
             *  });
             *
             *  Example 4:
             *  CWSSearchService.search(
             *      [
             *          // short alternative for: { field: 'name', searchString: client.name } if no other keys are defined
             *          {
             *              name: client.name
             *          },
             *          // search for all clients except the given:
             *          {
             *              field: '-id',
             *              searchString: client.id,
             *              // Do not run search if the 'name' clause above has no data (e.g. empty client.name);
             *              // see the above _buildStringQuery function for details.
             *              insufficient: true
             *          }
             *      ],
             *      {
             *          // short alternative to:
             *          // 'Client': {
             *          //    onResponse: function (results) { $scope.similarClients = results; }
             *          // }
             *          Client: function (results) { $scope.similarClients = results; }
             *      }
             *  );
             *
             * Example 5:
             * CWSSearchService.search(searchString,
             *  {
             *      'Reporter' : {
             *          onResponse: function (results) {
             *              // THIS WILL BE EXECUTED AS SOON AS Reporter SEARCH REQUEST IS RESOLVED
             *              $scope.reporters = results;
             *              $scope.updateRecordCount();
             *          },
             *          onSearchIntent: $scope.onSearchIntent
             *      },
             *      'Client' : {
             *          onSearchIntent: $scope.onSearchIntent
             *      }
             *  },
             *  {
             *      before: function () {
             *          $scope.recordCount = 0;
             *          $scope.reporters = [];
             *          $scope.clients = [];
             *      },
             *      resetResultsOnEmptyQuery: true
             *  }
             * ).then(function (results) {
             *      // THIS WILL BE EXECUTED ONLY AFTER ALL SEARCH REQUESTS ARE RESOLVED
             *      $scope.clients = results.Client;
             *      $scope.updateRecordCount();
             * });
             *
             * Example 6:
             *  CWSSearchService.search(searchString, ['Referral', 'Reporter', 'Client']).then(function(results) {
             *       if (results.Referral == null) {
             *           // there was nothing to search for
             *           $scope.show('');
             *
             *       } else {
             *           $scope.referrals = results.Referral;
             *           $scope.reporters = results.Reporter;
             *           $scope.clients = results.Client;
             *
             *           $scope.updateRecordCount();
             *           $scope.show('all');
             *       }
             *   });
             *
             * @param searchClause
             * @param searchFlowParams
             * @param extraParams
             * @return promise which is resolved when all promises for given search tasks are resolved;
             *  the result promise will be resolved with the following hash: { <EntityName> : <results> }
             *  which will contain null *values* if there was nothing to search for.
             */
            this.search = function (searchClause, searchFlowParams, extraParams) {

                if (angular.isObject(extraParams) && angular.isFunction(extraParams.before)) {
                    extraParams.before();
                }

                var stringQuery = _buildStringQuery(searchClause);

                var allSearchPromises = {};

                /*
                Transform searchFlowParams 'Referral' or ['Referral', 'Client'] into {'Referral': '', 'Client': ''}
                 */
                if (angular.isString(searchFlowParams)) {
                    searchFlowParams = [searchFlowParams];
                }
                if (angular.isArray(searchFlowParams)) {
                    searchFlowParams = _.transform(searchFlowParams, function(result, value) {
                        result[value] = '';
                    }, {});
                }

                angular.forEach(searchFlowParams, function (entitySearchParams, currentEntityName) {
                    /*
                    if entitySearchParams is a function, transform it to:
                      { onResponse: function ... }
                    to allow syntax like this:
                      'Reporter': function (results) { $scope.similarReporters = results; }
                    as short alternative to:
                      'Reporter': {
                          onResponse: function (results) { $scope.similarReporters = results; }
                      }
                    */
                    if (angular.isFunction(entitySearchParams)) {
                        entitySearchParams = { onResponse: entitySearchParams };
                    }

                    /*
                     * Pass search intent information in form of the following structure:
                     *  {
                     *      stringQuery: '<string>'
                     *          // Actual Elasticsearch String Query sent to backend;
                     *          // Search will not be executed if it's empty.
                     *      entity: '<entity name>'
                     *  }
                     */
                    if (angular.isFunction(entitySearchParams['onSearchIntent'])) {
                        entitySearchParams['onSearchIntent']({
                            stringQuery: stringQuery,
                            entityName: currentEntityName
                        });
                    }

                    // resolve Entity Search Service (like 'ClientSearch', 'ReporterSearch', etc)
                    var entitySearchService = $injector.get(currentEntityName + 'Search');
                    // execute search
                    var searchPromise = this.searchEntity(entitySearchService, stringQuery,
                        entitySearchParams['onResponse'],
                        angular.isFunction(entitySearchParams['onError']) ? entitySearchParams['onError'] : function () {
                            // todo detect IndexMissingException
                            // todo add such behavior to some other explicit function via option?
                            if (angular.isFunction(entitySearchParams['onResponse'])) entitySearchParams['onResponse']([]);
                        }
                    );
                    if (searchPromise != null) {
                        allSearchPromises[currentEntityName] = searchPromise;
                    }

                    if (angular.isObject(extraParams) && extraParams.resetResultsOnEmptyQuery && !stringQuery
                        && angular.isFunction(entitySearchParams['onResponse'])
                    ) {
                        entitySearchParams['onResponse']([]);
                    }
                }, this);

                return $q.all(allSearchPromises);
            };
        }]);
