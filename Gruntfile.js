'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/**/*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    var versionStringPlaceholder = '%%versionstring%%';
    var packageJson = grunt.file.readJSON('package.json');
    var versionString = packageJson.version + ' ' + packageJson.gitCommitHash + ' ' +
        packageJson.jenkinsBuildNumber + ' ' + packageJson.gitBranch;
    var baseURL = '/';
    var modRewrite = require('connect-modrewrite');

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/**/*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/**/*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            sass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            html: {
                files: ['<%= yeoman.app %>/*.html'],
                tasks: ['copy:baseURL']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '.tmp/styles/**/*.css',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9002,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35731
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect, options) {
                        var middlewares = [];

                        middlewares.push(modRewrite(['^(?!(/(styles|fonts|scripts|mockData|images|vendors|views|' +
                            'bower_components)/|/config.json)).*$ /index.html [L]']));
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });

                        return middlewares.concat([
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect().use(
                                '/vendors',
                                connect.static('./vendors')
                            ),
                            connect.static(appConfig.app)
                        ]);
                    }
                }
            },
            test: {
                options: {
                    port: 9002,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect().use(
                                '/vendors',
                                connect.static('./vendors')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                ignores:
                    [
                        '<%= yeoman.app %>/scripts/config.js',
                        '<%= yeoman.app %>/scripts/newrelic.js',
                        '<%= yeoman.app %>/scripts/GoogleAnalytics.js',
                        '<%= yeoman.app %>/scripts/common/services/jsonschema.js'
                    ]
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/**/*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/**/*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                options: {
                    force: true
                },
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/**/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version', 'iOS 8']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '**/*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            options: {
                cwd: '<%= yeoman.app %>'
            },
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: /\.\.\//
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                includePaths: [
                    'bower_components'
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    src: ['*.scss'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    src: ['*.scss'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/scripts/**/*.js',
                    '<%= yeoman.dist %>/styles/**/*.css',
                    '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp}',
                    // removed svg to work properly in sandbox dropdown menu actions
                    '<%= yeoman.dist %>/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
            }
        },

        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/style.css': [
        //         '.tmp/styles/**/*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '**/*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },

        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '**/*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['*.html', 'views/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Used instead of ngmin, because it's deprecated
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'views/**/*.html',
                            'images/**/*.{webp}',
                            'fonts/*',
                            'scripts/vendors/crypto.js',
                            'config.json'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: ['generated/*']
                    },
                    {
                        expand: true,
                        cwd: '.tmp/',
                        dest: '<%= yeoman.dist %>/',
                        src: ['index.html']
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '**/*.css'
            },
            stylesTr: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles/common',
                        dest: '<%= yeoman.app %>/tr/styles/backup/common',
                        src: '*.scss'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles/pages',
                        dest: '<%= yeoman.app %>/tr/styles/backup/pages',
                        src: ['*.scss', '**/*.scss']
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/tr/styles/common',
                        dest: '<%= yeoman.app %>/styles/common/',
                        src: '*.scss'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/tr/styles/pages',
                        dest: '<%= yeoman.app %>/styles/pages/',
                        src: ['*.scss', '**/*.scss']
                    }

                ]
            },
            restoreDefaultStyles: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/tr/styles/backup/common',
                        dest: '<%= yeoman.app %>/styles/common/',
                        src: '*.scss'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/tr/styles/backup/pages',
                        dest: '<%= yeoman.app %>/styles/pages/',
                        src: ['*.scss', '**/*.scss']
                    }
                ]
            },
            version: {
                src: ['<%= yeoman.dist %>/index.html'],
                dest: '<%= yeoman.dist %>/index.html',
                options: {
                    process: function (content) {
                        return content.replace(versionStringPlaceholder, versionString);
                    }
                }
            },
            baseURL: {
                src: ['<%= yeoman.app %>/index.html'],
                dest: '.tmp/index.html',
                options: {
                    process: function (content) {
                        return content.replace('%%baseURL%%', baseURL);
                    }
                }
            },
            zeroclipboard: {
                expand: true,
                cwd: 'bower_components/zeroclipboard/dist/',
                dest: '<%= yeoman.dist %>/scripts',
                src: ['ZeroClipboard.swf']
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'sass:server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'sass',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'wiredep',
            'concurrent:server',
            'autoprefixer',
            'copy:baseURL',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', function (url) {
        if (url) {
            baseURL = url;
        }

        grunt.task.run([
            'clean:dist',
            'wiredep',
            'useminPrepare',
            'concurrent:dist',
            'autoprefixer',
            'concat',
            'ngAnnotate',
            'copy:baseURL',
            'copy:dist',
            'copy:version',
            'copy:zeroclipboard',
            'cdnify',
            'cssmin',
            'uglify',
            'filerev',
            'usemin'
        ]);
    });

    grunt.registerTask('buildTR', function (url) {
        if (url) {
            baseURL = url;
        }

        grunt.task.run([
            'clean:dist',
            'copy:stylesTr',
            'wiredep',
            'useminPrepare',
            'concurrent:dist',
            'autoprefixer',
            'concat',
            'ngAnnotate',
            'copy:baseURL',
            'copy:dist',
            'copy:version',
            'copy:zeroclipboard',
            'cdnify',
            'cssmin',
            'uglify',
            'filerev',
            'usemin',
            'copy:restoreDefaultStyles'
        ]);
    });

    grunt.registerTask('stylesTR', function () {
        grunt.task.run([
            'copy:stylesTr'
        ]);
    });

    grunt.registerTask('restoreDefault', function () {
        grunt.task.run([
            'copy:restoreDefaultStyles'
        ]);
    });

    grunt.registerTask('default', [
        'newer:jshint',
        /*'test',*/
        'build'
    ]);

    grunt.registerTask('dist', [
        'connect:dist:keepalive'
    ]);
};
