angular.module('pcbApp', [])
  .directive('fileModel', ['$parse', function ($parse) {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function(){
                  scope.$apply(function(){
                      modelSetter(scope, element[0].files[0]);
                  });
              });
          }
      };
  }])
  .service('fileUpload', ['$http', function ($http) {
      this.uploadFileToUrl = function(file, uploadUrl, token){
          var fd = new FormData();
          fd.append('file', file);

          return $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: { 'Content-Type': undefined, 'Authorization': `Bearer ${token}` }
          });
      };
  }])
  .controller('AuthController', ['$http', '$window', function($http, $window) {
      const authCtrl = this;
      authCtrl.isAuthenticated = !!$window.localStorage.getItem('token');
      authCtrl.credentials = {};
      authCtrl.newUser = {};
      authCtrl.pwrst = {};

      authCtrl.login = function() {
          $http.post('http://localhost:3000/api/login', authCtrl.credentials)
              .then(response => {
                  $window.localStorage.setItem('token', response.data.token);
                  authCtrl.isAuthenticated = true;
                  $window.location.reload();
              }, error => {
                  console.error('Login error:', error.data.error);
              });
      };

      authCtrl.register = function() {
          $http.post('http://localhost:3000/api/register', authCtrl.newUser)
              .then(response => {
                  $window.localStorage.setItem('token', response.data.token);
                  authCtrl.isAuthenticated = true;
                  $window.location.reload();
              }, error => {
                  console.error('Registration error:', error.data.error);
              });
      };

      authCtrl.logout = function() {
          $window.localStorage.removeItem('token');
          authCtrl.isAuthenticated = false;
          $window.location.reload();
      };

      authCtrl.checkAuth = function() {
        const token = $window.localStorage.getItem('token');
        if (token != null)
        {$http.get('http://localhost:3000/api/checkAuth', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
        }, error => {
            if (authCtrl.isAuthenticated)
            {
                authCtrl.logout();
            }
        });
        }
        }
      authCtrl.pw_reset = function() {
        $http.post('http://localhost:3000/api/pwrst', authCtrl.pwrst)
              .then(response => {
                  $window.location.href = 'http://localhost:8080/login.html';
              }, error => {
                  console.error('Reset error:', error.data.error);
              });
      };
      authCtrl.checkAuth();
  }])
  .controller('PartsController', ['$http', '$window', 'fileUpload', function($http, $window, fileUpload) {
      const ctrl = this;
      ctrl.parts = [];
      ctrl.newPart = {};
      ctrl.isEditing = false;
      ctrl.editablePart = null;
      const token = $window.localStorage.getItem('token');

      ctrl.getParts = function() {
          $http.get('http://localhost:3000/api/parts', { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  ctrl.parts = response.data.data;
              });
      };

      ctrl.addPart = function() {
          $http.post('http://localhost:3000/api/parts', ctrl.newPart, { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  ctrl.parts.push(response.data.data);
                  ctrl.newPart = {};
                  $window.location.reload();
              });
      };

      ctrl.updatePart = function(part) {
        console.log("we're getting called");
          if (part.isEditing) {
            $http.put(`http://localhost:3000/api/parts/${part.id}`, part, { headers: { 'Authorization': `Bearer ${token}`}})
            .then(response => {
                part.isEditing = false;
                part.editablePart = null;
                $window.location.reload();
            });
          } else {
            part.isEditing = true;
            part.editablePart = angular.copy(part);
          }
      };

      ctrl.cancelEdit = function(part) {
        part.isEditing = false;
        part.editablePart = null;
      };

      ctrl.deletePart = function(id) {
          $http.delete(`http://localhost:3000/api/parts/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  ctrl.getParts();
              });
      };

      ctrl.uploadFile = function() {
          const file = ctrl.myFile;
          const uploadUrl = 'http://localhost:3000/api/upload';
          fileUpload.uploadFileToUrl(file, uploadUrl, token)
              .then(response => {
                  console.log(response.data.message);
                  ctrl.getParts();
                  $window.location.reload();
              });
      };

      ctrl.getParts();
  }])
  .controller('ProjectsController', ['$http', '$window', 'fileUpload', function($http, $window, fileUpload) {
      const prjctrl = this;
      prjctrl.projects = [];
      prjctrl.newProject = {};
      prjctrl.partlists = [];
      prjctrl.newPartList = {};
      prjctrl.projectBuild = {};

      const token = $window.localStorage.getItem('token');
      
      prjctrl.getProjects = function() {
        $http.get('http://localhost:3000/api/projects', { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  prjctrl.projects = response.data.data;
              });
      }

      prjctrl.addProject = function(project) {
        $http.post('http://localhost:3000/api/projects', prjctrl.newProject, { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  prjctrl.projects.push(response.data.data);
                  prjctrl.newProject = {};
              });
      }
      prjctrl.deleteProject = function(id) {
        $http.delete(`http://localhost:3000/api/projects/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  prjctrl.getProjects();
              });
      }

      prjctrl.getPartLists = function() {
        $http.get('http://localhost:3000/api/partlists', { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  prjctrl.partlists = response.data.data;
              });
      }

      prjctrl.addPartList = function(partlist) {
        console.log(prjctrl.newPartList);
        $http.post('http://localhost:3000/api/partlists', prjctrl.newPartList, { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  prjctrl.partlists.push(response.data.data);
                  prjctrl.newPartList = {};
                  prjctrl.getPartLists()
              });
      }

      prjctrl.addToPartList = function(parts) {
        $http.post(`http://localhost:3000/api/partlists/${parts.id}`, parts, { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  prjctrl.partlists.push(response.data.data);
                  prjctrl.newPartList = {};
              });
      }

      prjctrl.deletePart = function(id) {
        $http.delete(`http://localhost:3000/api/partlists/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
              .then(response => {
                  prjctrl.getPartLists();
              });
      }

      prjctrl.buildBoards = function(build) {
        $http.post('http://localhost:3000/api/project/build', prjctrl.projectBuild, { headers: { 'Authorization': `Bearer ${token}` }})
             .then(response => {
                prjctrl.projectBuild = {};
                $window.location.reload();
             })
      }

      prjctrl.getProjects();
      prjctrl.getPartLists();
  }]);