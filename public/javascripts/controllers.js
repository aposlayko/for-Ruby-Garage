'use strict';

/* Controllers */

var taskManagerControllers = angular.module('taskControllers', []);

taskManagerControllers.controller('mainCtrl', ['$scope', '$http', '$rootScope', '$location',
    function ($scope, $http, $rootScope, $location) {
        $rootScope.isAutorized = false; //change back to false!
        $rootScope.showAuth = false;
        $rootScope.email = '';
        $rootScope.id = '';
        $rootScope.projects = [];

        $rootScope.saveUser = function () {
            $http.post('/saveUserData', {id: $rootScope.id, projects: $rootScope.projects})
                .success(function (data, status, headers, config) {
                    if (data.success) {
                        console.log("Saving user data success");
                    } else {
                        $scope.err = data.error;
                    }
                }).
                error(function () {
                    console.warn('Some error with saving user data');
                });
        };
        function checkSession () {
            $http.get('/checkSession')
                .success(function (data, status, headers, config) {
                    if (data.success) {
                        console.log("checkSession success");
                        $rootScope.email = data.email;
                        $rootScope.id = data.user_id;
                        $rootScope.isAutorized = true;
                        $scope.err = '';
                    } else {
                        console.log(data.error);
                    }
                }).
                error(function () {
                    console.warn('Some error with creating item');
                });
        }
        checkSession();

        $scope.logOut = function () {
            $rootScope.isAutorized = false;
            $rootScope.email = '';
            $rootScope.id = '';
            $rootScope.projects = [];
            $http.get('/sessionDestroy');
            $location.path('/');
        };

        $scope.profileSettings = function () {
            $location.path('/edit-profile');
        };

    }]);

taskManagerControllers.controller('editProfileCtrl', ['$scope', '$http', '$rootScope', '$location',
    function ($scope, $http, $rootScope, $location) {
        console.log('Edit profile');
        $scope.editUser = {email: $rootScope.email};
        $scope.pass = {};

        $scope.err = '';
        $scope.success = '';
        $scope.showChangePass = false;

        //show change password form
        $scope.changePassword = function () {
            $scope.showChangePass = !$scope.showChangePass;
        };

        //submit changing password data
        $scope.submitChangePass = function () {
            console.log({id: $rootScope.id, pass: $scope.pass.password});
            $http.post('/changePass', {id: $rootScope.id, pass: $scope.pass.password})
                .success(function (data, status, headers, config) {
                    if (data.success) {
                        console.log('Changing password success');
                        $scope.success = 'Changing password success';
                        $scope.err = '';
                    } else {
                        $scope.err = data.error;
                        $scope.success = '';
                    }
                }).
                error(function () {
                    console.warn('Some error with editing profile');
                });
        };

        //loading user info
        $http.post('/edit-profile', {id: $rootScope.id})
            .success(function (data, status, headers, config) {
                if (data.success) {
                    $scope.editUser = data.user;
                } else {
                    $scope.err = data.error;
                }
            }).
            error(function () {
                console.warn('Some error with editing profile');
            });

        //submit user info
        $scope.submitProfileForm = function () {
            $http.post('/saveProfile', $scope.editUser)
                .success(function (data, status, headers, config) {
                    if (data.success) {
                        console.log('Save success');
                        $scope.success = 'Saving success';
                    } else {
                        $scope.err = data.error;
                    }
                }).
                error(function () {
                    console.warn('Some error with saving profile');
                });
        };

        //deleting profile
        $scope.deleteProfile = function () {
            console.log($rootScope.id);
            $http.post('/deleteProfile', {id: $rootScope.id})
                .success(function (data, status, headers, config) {
                    if (data.success) {
                        console.log('Delete success');
                        $location.path('/');
                        $rootScope.isAutorized = false;
                        $rootScope.email = '';
                        $rootScope.id = '';
                    } else {
                        $scope.err = data.error;
                    }
                }).
                error(function () {
                    console.warn('Some error with deleting profile');
                });
        };

    }]);

taskManagerControllers.controller('loginCtrl', ['$scope', '$http', '$rootScope', '$location',
    function ($scope, $http, $rootScope, $location) {
        $scope.user = {
            email: '',
            password: ''
        };
        $scope.err = '';

        $scope.submit = function () {
            $http.post('/checkUser', $scope.user).
                success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.success) {
                        $rootScope.isAutorized = true;
                        $scope.err = '';
                        $rootScope.email = data.email;
                        $rootScope.id = data.id;
                        if(data.user.projects) {
                            $rootScope.projects = data.user.projects;
                        }

                        if ($scope.user.remember) {
                            console.log(data.id);
                            saveSession({id: data.id, email: data.email});
                        }
                        $location.path('/');
                    } else {
                        $scope.err = data.error;
                    }
            }).
                error(function() {
                    console.warn('Some error with log in');
                });
        };

        function saveSession (user) {
            //console.log(user);
            $http.post('/saveSession', user).
                success(function(data, status, headers, config) {

                    if(data.success) {
                        console.log('Session create success');
                    } else {
                        $scope.err = data.error;
                    }
                }).
                error(function() {
                    console.warn('Some error with log in');
                });
        }

        //registration
        $scope.signUp = function () {
            $rootScope.isAutorized = false;
            $rootScope.showAuth = true;
        };
    }]);

taskManagerControllers.controller('authCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.user = {};
        $scope.err = '';

        $scope.cancelAuth = function () {
            $rootScope.isAutorized = false;
            $rootScope.showAuth = false;
        };

        $scope.submitForm = function () {
            console.log($scope.user);
            $http.post('/authUser', $scope.user).
                success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.success) {
                        console.log('Registration success!');
                        $scope.err = '';
                        $rootScope.isAutorized = true;
                        $rootScope.showAuth = false;
                        $rootScope.email = $scope.user.email;
                        $rootScope.id = data.user_id;
                    } else {
                        $scope.err = data.error;
                    }
                }).
                error(function() {
                    console.warn('Something wrong, response failed');
                });

        };
    }]);

taskManagerControllers.controller('taskManagerCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        var dateToday = new Date();
        $("#datepicker").datepicker({
            dateFormat: "dd-mm-yy",
            /*minDate: dateToday,*/
            onSelect: function () {
                $scope.dateFromDatapicker = $(this).datepicker('getDate');
            }
        });
        $scope.dates = [];

        $scope.checkDeadline = function (date) {
            return Date.parse(date) < Date.now();
        };

        $scope.saveNewList = function () {
            $rootScope.projects.push({name: $scope.listName});
            $scope.listName = '';
            $rootScope.saveUser();
            $('#create-proj-modal').modal('hide');
        };

        $scope.showEditProjModal = function (project) {
            $scope.editedProject = project;
            $scope.editedProjectName = project.name;
        };

        $scope.editProject = function () {
            $scope.editedProject.name = $scope.editedProjectName;
            $rootScope.saveUser();
            $scope.editedProjectName = '';
            $('#edit-proj-modal').modal('hide');
        };

        $scope.showEditTaskModal = function (task) {
            var date = new Date(Date.parse(task.dateOfDeadline));
            $( "#datepicker" ).datepicker("setDate" , date);

            $scope.editedTaskName = task.name;
            $scope.editedTask = task;
        };

        $scope.editTask = function () {
            $scope.editedTask.name = $scope.editedTaskName;
            if ($scope.dateFromDatapicker) {
                $scope.editedTask.dateOfDeadline = $scope.dateFromDatapicker.toISOString();
                $scope.dateFromDatapicker = null;
            }

            $rootScope.saveUser();
            $scope.editedTaskName = '';
            $('#edit-task-modal').modal('hide');
        };

        $scope.deleteProject = function (project) {
            $rootScope.projects.splice($rootScope.projects.indexOf(project), 1);
            $rootScope.saveUser();
        };

        $scope.saveTask = function (project, taskName) {
            var day = 86400000;
            if (!project.tasks) project.tasks = [];
            project.tasks.push({  //save to $rootScope.projects
                name: taskName,
                priority: getDefaultPriority(project.tasks),
                dateOfDeadline: (new Date(Date.now() + day)).toISOString()
            });
            $rootScope.saveUser();
            $('.new-task-input').val('');
            $scope.taskName = '';
        };

        $scope.deleteTask = function (task, project) {
            project.tasks.splice(project.tasks.indexOf(task), 1);
            $rootScope.saveUser();
        };

        $scope.changePriority = function(isMorePriority, project, task) {
            var taskIndex,
                priority;

            project.tasks.sort(sortTasks);
            taskIndex = project.tasks.indexOf(task);

            function sortTasks (a, b) {
                if (a.priority < b.priority) return -1;
                if (a.priority > b.priority) return 1;
                return 0;
            }

            if (isMorePriority) {
                if (taskIndex !== 0) {
                    priority = task.priority;
                    task.priority = project.tasks[taskIndex - 1].priority;
                    project.tasks[taskIndex - 1].priority = priority;
                    $rootScope.saveUser();
                }
            } else {
                if (taskIndex !== project.tasks.length - 1) {
                    priority = task.priority;
                    task.priority = project.tasks[taskIndex + 1].priority;
                    project.tasks[taskIndex + 1].priority = priority;
                    $rootScope.saveUser();
                }
            }
        };

        function getDefaultPriority (tasks) {
            var length = tasks.length,
                prArr = [],
                max = 0,
                i = 0;
            if (length) {
                for (i; i < length; i++) {
                    prArr.push(tasks[i].priority);
                }
                max = Math.max.apply(Math, prArr);
                max++;
            }
            return max;
        }
    }]);
