// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'App' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', ['ionic', 'ngCordova', 'ngAnimate', 'IonicitudeModule',
  "ngSanitize",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  "com.2fdevs.videogular.plugins.poster"
])

  .run(['$ionicPlatform', '$sqliteService', 'Ionicitude',
    function ($ionicPlatform, $sqliteService, Ionicitude) {
      $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }

        // The code placed inside the $ionicPlatform.ready() function is executed only when the device is ready,
        // so this is a perfect place to call the Ionicitude.init() method.
        Ionicitude.init()
          .then(function () {
            console.log('Here you go. Ionicitude is fully initialized !');
            // Now that Ionicitude is initialized, we can safely add the Actions that could be called from within an Le système solaire.
            // Note that these actions will be executed by the Ionic WebView and in its context.
            // To call this captureScreen action, there should be, in one of your AR World JS code and assuming that you're using Ionicitude's CHM, something like :
            //  document.location = architectsdk://captureScreen
            Ionicitude
              .addAction(captureScreen)
              .addAction(markerselected);
          })
          .catch(function (error) {
            console.log("Hu-ho..! Something has failed !", error);
          });

        // It suggested to declare your Action as named function instead of passing callbacks to Ionicitude.addAction().
        // It's somewhat more readable.

        //Load the Pre-populated database, debug = true
        $sqliteService.preloadDataBase(true);
      });
    }
  ])

  .config(['$stateProvider',
    '$urlRouterProvider',
    '$ionicConfigProvider',
    '$compileProvider',
    function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content|ms-appx|x-wmapp0):|data:image\/|img\//);
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);

      $ionicConfigProvider.scrolling.jsScrolling(ionic.Platform.isIOS());

      $stateProvider
        .state('home', {
          url        : "/home",
          templateUrl: "templates/home.html",
          controller : 'HomeController'
        })
        .state('app', {
          url        : '/app',
          abstract   : true,
          controller : 'AppController',
          templateUrl: 'templates/menu.html'
        })
        .state('app.gallery', {
          url  : "/gallery",
          cache: false,
          views: {
            viewContent: {
              templateUrl: "templates/gallery.html",
              controller : 'GalleryController'
            }
          }
        })

        .state('app.item', {
          url   : "/item/{title}",
          params: {
            color: null,
            icon : null
          },
          cache : false,
          views : {
            viewContent: {
              templateUrl: "templates/item.html",
              controller : 'ItemController'
            }
          }
        })

        .state('app.ar', {
          url   : "/ar",
          cache : false,
          params: {
            color: null,
            icon : null
          },
          views : {
            viewContent: {
              templateUrl: "templates/AR_menu.html",
              controller : 'MainCtrl'
            }
          }
        })

        .state('app.videos', {
          url   : "/videos",
          cache : false,
          params: {
            color: null,
            icon : null
          },
          views : {
            viewContent: {
              templateUrl: "templates/video.html",
              controller : 'VideoCtrl'
            }
          }
        })
        .state('app.videosYT', {
          url   : "/videosYT",
          cache : false,
          params: {
            color: null,
            icon : null
          },
          views : {
            viewContent: {
              templateUrl: "templates/videoYT.html",
              controller : 'VideoYTCtrl'
            }
          }
        });


      $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get("$state");
        $state.go("home");
      });
    }
  ]);

/* global ionic */
(function (angular, ionic) {
  "use strict";

  ionic.Platform.isIE = function () {
    return ionic.Platform.ua.toLowerCase().indexOf('trident') > -1;
  }

  if (ionic.Platform.isIE()) {
    angular.module('ionic')
      .factory('$ionicNgClick', ['$parse', '$timeout', function ($parse, $timeout) {
        return function (scope, element, clickExpr) {
          var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);

          element.on('click', function (event) {
            scope.$apply(function () {
              if (scope.clicktimer) return; // Second call
              clickHandler(scope, {
                $event: (event)
              });
              scope.clicktimer = $timeout(function () {
                delete scope.clicktimer;
              }, 1, false);
            });
          });

          // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
          // something else nearby.
          element.onclick = function (event) {
          };
        };
      }]);
  }

  function SelectDirective() {
    'use strict';

    return {
      restrict: 'E',
      replace : false,
      link    : function (scope, element) {
        if (ionic.Platform && (ionic.Platform.isWindowsPhone() || ionic.Platform.isIE() || ionic.Platform.platform() === "edge")) {
          element.attr('data-tap-disabled', 'true');
        }
      }
    };
  }

  angular.module('ionic')
    .directive('select', SelectDirective);

  /*angular.module('ionic-datepicker')
   .directive('select', SelectDirective);*/

})(angular, ionic);
window.queries = [
  //Drop tables
  "DROP TABLE IF EXISTS Users;",
  //Create tables
  "CREATE TABLE Users (IdUser integer primary key autoincrement, Name text not null);",
  //Insert Users
  "INSERT INTO 'Users' ('Name') VALUES ('Vivien Larriere');"
];
(function () {
  'use strict';

  angular
    .module('App')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', '$ionicPopover', '$injector'];

  function AppController($scope, $ionicPopover, $injector) {

    $scope.items =
      [{
        color: "#184d77",
        icon : "ion-planet",
        title: "Le système solaire",
        path : "app.ar"
      },
        {
          color: "#40585d",
          icon : "ion-ios-videocam",
          title: "Nos gardiens",
          path : "app.videos"
        },
        {
          color: "#5d0b09",
          icon : "ion-ios-videocam",
          title: "Notre galaxie",
          path : "app.videosYT"
        }

      ];

    $scope.exitApp = function () {
      ionic.Platform.exitApp();
    };

    $ionicPopover.fromTemplateUrl('templates/modals/popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };

    $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .controller('GalleryController', GalleryController);

  GalleryController.$inject = ['$scope', '$state'];

  function GalleryController($scope, $state) {
    $scope.openItem = function (item) {
      switch (item.title) {
        case "Le système solaire":
          $state.go("app.ar");
          break;

        case "Nos gardiens":
          $state.go('app.videos');
          break;

        case "Notre galaxie":
          $state.go('app.videosYT');
          break;

        default:
          $state.go('app.home');
          break;
      }
    };
  }
})();


(function () {
  'use strict';

  angular
    .module('App')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$ionicPopup', 'Modals', 'Model'];

  function HomeController($scope, $ionicPopup, Modals, Model) {

    $scope.users = [];

    $scope.HelloWorld = function () {
      $ionicPopup.alert({
        title   : 'Hello World',
        template: 'Bienvenue !',
        cssClass: 'animated bounceInDown'
      });
    };

    $scope.showUsers = function () {
      Model.Users.getAll().then(function (users) {
        $scope.users = angular.copy(users);
      });
      Modals.openModal($scope, 'templates/modals/users.html', 'animated rotateInDownLeft');
    };

    $scope.closeModal = function () {
      Modals.closeModal();
      $scope.users = [];
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .controller('ItemController', ItemController);

  ItemController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

  function ItemController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {

    $scope.item = {
      title: $stateParams.title,
      icon : $stateParams.icon,
      color: $stateParams.color,
      path : $stateParams.path
    };

    if (!$scope.item.color) {
      $ionicViewSwitcher.nextDirection('back');
      $ionicHistory.nextViewOptions({
        disableBack   : true,
        disableAnimate: true,
        historyRoot   : true
      });
      $state.go('app.gallery');
    }

    $scope.openItem = function (item) {
      console.log(item);
      switch (item.title) {
        case "Le système solaire":
          $state.go("app.ar");
          break;

        case "Nos gardiens":
          $state.go('app.videos');
          break;

        default:
          $state.go('app.home');
          break;
      }
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .directive('holdList', holdList);

  holdList.$inject = ['$ionicGesture'];

  function holdList($ionicGesture) {

    return {
      restrict: 'A',
      link    : function (scope, element, attrs) {
        $ionicGesture.on('hold', function (e) {

          var content = element[0].querySelector('.item-content');

          var buttons = element[0].querySelector('.item-options');
          var buttonsWidth = buttons.offsetWidth;

          ionic.requestAnimationFrame(function () {
            content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

            if (!buttons.classList.contains('invisible')) {
              content.style[ionic.CSS.TRANSFORM] = '';
              setTimeout(function () {
                buttons.classList.add('invisible');
              }, 250);
            } else {
              buttons.classList.remove('invisible');
              content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
            }
          });


        }, element);
      }
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .directive('ionMultipleSelect', ionMultipleSelect);

  ionMultipleSelect.$inject = ['$ionicModal', '$ionicGesture'];

  function ionMultipleSelect($ionicModal, $ionicGesture) {

    return {
      restrict  : 'E',
      scope     : {
        options: "="
      },
      controller: function ($scope, $element, $attrs) {
        $scope.multipleSelect = {
          title           : $attrs.title || "Select Options",
          tempOptions     : [],
          keyProperty     : $attrs.keyProperty || "id",
          valueProperty   : $attrs.valueProperty || "value",
          selectedProperty: $attrs.selectedProperty || "selected",
          templateUrl     : $attrs.templateUrl || 'templates/multipleSelect.html',
          renderCheckbox  : $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
          animation       : $attrs.animation || 'slide-in-up'
        };

        $scope.OpenModalFromTemplate = function (templateUrl) {
          $ionicModal.fromTemplateUrl(templateUrl, {
            scope    : $scope,
            animation: $scope.multipleSelect.animation
          }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        };

        $ionicGesture.on('tap', function (e) {
          $scope.multipleSelect.tempOptions = $scope.options.map(function (option) {
            var tempOption = {};
            tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
            tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
            tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];

            return tempOption;
          });
          $scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
        }, $element);

        $scope.saveOptions = function () {
          for (var i = 0; i < $scope.multipleSelect.tempOptions.length; i++) {
            var tempOption = $scope.multipleSelect.tempOptions[i];
            for (var j = 0; j < $scope.options.length; j++) {
              var option = $scope.options[j];
              if (tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]) {
                option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
                break;
              }
            }
          }
          $scope.closeModal();
        };

        $scope.closeModal = function () {
          $scope.modal.remove();
        };
        $scope.$on('$destroy', function () {
          if ($scope.modal) {
            $scope.modal.remove();
          }
        });
      }
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .directive('ionSearchSelect', ionSearchSelect);

  ionSearchSelect.$inject = ['$ionicModal', '$ionicGesture'];

  function ionSearchSelect($ionicModal, $ionicGesture) {

    return {
      restrict  : 'E',
      scope     : {
        options       : "=",
        optionSelected: "="
      },
      controller: function ($scope, $element, $attrs) {
        $scope.searchSelect = {
          title        : $attrs.title || "Search",
          keyProperty  : $attrs.keyProperty,
          valueProperty: $attrs.valueProperty,
          templateUrl  : $attrs.templateUrl || 'templates/searchSelect.html',
          animation    : $attrs.animation || 'slide-in-up',
          option       : null,
          searchvalue  : "",
          enableSearch : $attrs.enableSearch ? $attrs.enableSearch == "true" : true
        };

        $ionicGesture.on('tap', function (e) {

          if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
            if ($scope.optionSelected) {
              $scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
            }
          } else {
            $scope.searchSelect.option = $scope.optionSelected;
          }
          $scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
        }, $element);

        $scope.saveOption = function () {
          if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
            for (var i = 0; i < $scope.options.length; i++) {
              var currentOption = $scope.options[i];
              if (currentOption[$scope.searchSelect.keyProperty] == $scope.searchSelect.option) {
                $scope.optionSelected = currentOption;
                break;
              }
            }
          } else {
            $scope.optionSelected = $scope.searchSelect.option;
          }
          $scope.searchSelect.searchvalue = "";
          $scope.modal.remove();
        };

        $scope.clearSearch = function () {
          $scope.searchSelect.searchvalue = "";
        };

        $scope.closeModal = function () {
          $scope.modal.remove();
        };
        $scope.$on('$destroy', function () {
          if ($scope.modal) {
            $scope.modal.remove();
          }
        });

        $scope.OpenModalFromTemplate = function (templateUrl) {
          $ionicModal.fromTemplateUrl(templateUrl, {
            scope    : $scope,
            animation: $scope.searchSelect.animation
          }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        };
      }
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .factory('Modals', Modals);

  Modals.$inject = ['$ionicModal'];

  function Modals($ionicModal) {

    var modals = [];

    var _openModal = function ($scope, templateUrl, animation) {
      return $ionicModal.fromTemplateUrl(templateUrl, {
        scope               : $scope,
        animation           : animation || 'slide-in-up',
        backdropClickToClose: false
      }).then(function (modal) {
        modals.push(modal);
        modal.show();
      });
    };

    var _closeModal = function () {
      var currentModal = modals.splice(-1, 1)[0];
      currentModal.remove();
    };

    var _closeAllModals = function () {
      modals.map(function (modal) {
        modal.remove();
      });
      modals = [];
    };

    return {
      openModal     : _openModal,
      closeModal    : _closeModal,
      closeAllModals: _closeAllModals
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .factory('Model', Model);

  Model.$inject = ['Users'];

  function Model(Users) {

    return {
      Users: Users
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .service('$sqliteService', $sqliteService);

  $sqliteService.$inject = ['$q', '$cordovaSQLite'];

  function $sqliteService($q, $cordovaSQLite) {

    var self = this;
    var _db;

    self.db = function () {
      if (!_db) {
        if (window.sqlitePlugin !== undefined) {
          _db = window.sqlitePlugin.openDatabase({
            name              : "pre.db",
            location          : 2,
            createFromLocation: 1
          });
        } else {
          // For debugging in the browser
          _db = window.openDatabase("pre.db", "1.0", "Database", 200000);
        }
      }
      return _db;
    };

    self.getFirstItem = function (query, parameters) {
      var deferred = $q.defer();
      self.executeSql(query, parameters).then(function (res) {

        if (res.rows.length > 0)
          return deferred.resolve(res.rows.item(0));
        else
          return deferred.reject("There aren't items matching");
      }, function (err) {
        return deferred.reject(err);
      });

      return deferred.promise;
    };

    self.getFirstOrDefaultItem = function (query, parameters) {
      var deferred = $q.defer();
      self.executeSql(query, parameters).then(function (res) {

        if (res.rows.length > 0)
          return deferred.resolve(res.rows.item(0));
        else
          return deferred.resolve(null);
      }, function (err) {
        return deferred.reject(err);
      });

      return deferred.promise;
    };

    self.getItems = function (query, parameters) {
      var deferred = $q.defer();
      self.executeSql(query, parameters).then(function (res) {
        var items = [];
        for (var i = 0; i < res.rows.length; i++) {
          items.push(res.rows.item(i));
        }
        return deferred.resolve(items);
      }, function (err) {
        return deferred.reject(err);
      });

      return deferred.promise;
    };

    self.preloadDataBase = function (enableLog) {
      var deferred = $q.defer();

      //window.open("data:text/plain;charset=utf-8," + JSON.stringify({ data: window.queries.join('').replace(/\\n/g, '\n') }));
      if (window.sqlitePlugin === undefined) {
        enableLog && console.log('%c ***************** Starting the creation of the database in the browser ***************** ', 'background: #222; color: #bada55');
        self.db().transaction(function (tx) {
          for (var i = 0; i < window.queries.length; i++) {
            var query = window.queries[i].replace(/\\n/g, '\n');

            enableLog && console.log(window.queries[i]);
            tx.executeSql(query);
          }
        }, function (error) {
          deferred.reject(error);
        }, function () {
          enableLog && console.log('%c ***************** Completing the creation of the database in the browser ***************** ', 'background: #222; color: #bada55');
          deferred.resolve("OK");
        });
      } else {
        deferred.resolve("OK");
      }

      return deferred.promise;
    };

    self.executeSql = function (query, parameters) {
      return $cordovaSQLite.execute(self.db(), query, parameters);
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('App')
    .factory('Users', Users);

  Users.$inject = ['$q', '$sqliteService'];

  function Users($q, $sqliteService) {

    return {
      getAll: function () {
        var query = "Select * FROM Users";
        return $q.when($sqliteService.getItems(query));
      },
      add   : function (user) {
        var query = "INSERT INTO Users (Name) VALUES (?)";
        return $q.when($sqliteService.executeSql(query, [user.Name]));
      }
    };
  }
})();

(function () {
  'use strict';

  angular.module('App')
    .controller('MainCtrl', function ($scope, Ionicitude) {
      $scope.launchAR = function (ref) {
        try {
          // The ref passed as an argument to Ionicitude.launchAR() must be the name
          // of a directory in the wikitude-worlds directory.
          Ionicitude.launchAR(ref)
            .then(function () {
              console.log('OK ! The ' + ref + ' AR World has been perfectly launched !');
            })
            .catch(function (error) {
              console.log('Error while trying to launch the ' + ref + ' AR World.', error);
            })
        } catch (error) {
          console.log('######################');
          console.log('######################');
          console.log('But... Why ?! Something happened ?', error);
          console.log('######################');
          console.log('######################');
        }
      }
    });
})();

(function () {
  'use strict';

  angular.module('App')
    .controller('VideoYTCtrl', function ($scope) {
      // blabla
    });
})();

(function () {
  'use strict';
  angular.module('App')
    .controller('VideoCtrl',
      ["$sce", function ($sce) {
        this.config = {
          preload: "none",
          sources: [
            {
              src : "./vid/Gotg.mp4",
              type: "video/mp4"
            }
          ],
          tracks : [
            {
              src    : "./vid/subs/Gotg_fr.vtt",
              kind   : "subtitles",
              srclang: "fr",
              label  : "Français",
              default: "default"
            }
          ],
          theme  : {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
          },
          plugins: {
            poster  : "./vid/posters/Gotg.jpg",
            controls: {
              autoHide    : true,
              autoHideTime: 3000
            }
          }

        };
      }]
    )
    .directive("mySubsButton",
      function () {
        return {
          restrict: "E",
          require : "^videogular",
          template: "<div class='iconButton' ng-click='API.stop()'>STOP</div>",
          link    : function (scope, elem, attrs, API) {
            scope.API = API;
          }
        }
      }
    );
})();


