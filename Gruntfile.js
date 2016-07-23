module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // we could just concatenate everything, really
        // but we like to have it the complex way.
        // also, in this way we do not have to worry
        // about putting files in the correct order
        // (the dependency tree is walked by r.js)
        less: {
            dist: {
                options: {
                    paths: [],
                    strictMath: false,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '++theme++booster/less/booster-compiled.css.map',
                    sourceMapFilename: 'plonetheme/booster/theme/less/booster-compiled.css.map',
                    modifyVars: {
                        "isPlone": "false"
                    }
                },
                files: {
                    'plonetheme/booster/theme/styles/main.css': 'plonetheme/booster/theme/less/main.less'
                }
            }
        },

        watch: {
            scripts: {
                files: ['plonetheme/booster/theme/scripts/**/*.js'],
                tasks: ['jshint', 'uglify']
            },
            stylesheets: {
              files: ['plonetheme/booster/theme/**/*.css', 'plonetheme/booster/theme/**/*.less'],
              tasks: ['less']
            },
            // html:{
            //     files: ['plonetheme/booster/theme/index.html'],
            //     tasks: ['htmlmin']
            // },
        },
        browserSync: {
            html: {
                bsFiles: {
                    src : ['plonetheme/booster/theme/less/*.less']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    server: {
                        baseDir: "."
                    }
                }
            },
            plone: {
                bsFiles: {
                    src : ['plonetheme/booster/theme/less/*.less']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    proxy: "localhost:8080"
                }
            }
        },

        jshint: {
             options: {
                reporter: require('jshint-stylish'),
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
            },

             build: ['Gruntfile.js', 'plonetheme/booster/theme/scripts/**/*.js']
        },

        uglify: {
              options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
              },
              build: {
                files: {
                  'dist/scripts/main.js': 'plonetheme/booster/theme/scripts/**/*.js'
                }
            }
        },

        cssmin: {
              options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
              },
              build: {
                files: {
                  'dist/styles/main.css': 'plonetheme/booster/theme/styles/main.css'
                }
            }
        },

        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'plonetheme/booster/theme/index.html',     // 'destination': 'source'
                }
            },
        },

        copy: {
          dist: {
            files: [
              // includes files within path
              {expand: true, flatten: true, src: ['plonetheme/booster/theme/*'], dest: 'dist/', filter: 'isFile'},

              // includes files within path and its sub-directories
              {expand: true, cwd: 'plonetheme/booster/theme/', src: ['images/**', 'views/**', 'template-overrides/**'], dest: 'dist/'},

              // makes all src relative to cwd
              // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

              // flattens results to a single level
              // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
            ],
          },
        },

        // make a zipfile
        compress: {
          dist: {
            options: {
              archive: 'plonetheme.booster.zip'
            },
            files: [
              {src: ['dist/**'], dest: '', filter: 'isFile'}, // includes files in path
            ]
          }
        },

    });

    // grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('bsync', ["browserSync:html", "watch"]);
    grunt.registerTask('plone-bsync', ["browserSync:plone", "watch"]);
    grunt.registerTask('dist', ['copy', 'jshint', 'uglify', 'cssmin', 'less', 'compress']);
};
