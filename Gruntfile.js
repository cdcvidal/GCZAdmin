module.exports = function(grunt) {
    grunt.initConfig({
        config: {
          dev: {
            options: {
              variables: {
                'env': 'dev',
                //'api_base_url': 'https://humm-server-preprod.eu-gb.mybluemix.net/api',
                'api_base_url': 'http://localhost:3000/api',
                'cacheBuster': new Date().toJSON().replace(/-/g, '').replace(/:/g, '').replace('T', '').replace('.', '-')
              }
            }
          },
          preprod: {
            options: {
              variables: {
                'env': 'preprod',
                'api_base_url': 'https://humm-server-preprod.eu-gb.mybluemix.net/api',
                'cacheBuster': new Date().toJSON().replace(/-/g, '').replace(/:/g, '').replace('T', '').replace('.', '-')
              }
            }
          },
          prod: {
            options: {
              variables: {
                'env': 'prod',
                'api_base_url': 'https://humm-server.eu-gb.mybluemix.net/api',
                'cacheBuster': new Date().toJSON().replace(/-/g, '').replace(/:/g, '').replace('T', '').replace('.', '-')
              }
            }
          }
        },
        replace: {
          dist: {
            options: {
              variables: {
                'env': '<%= grunt.config.get("env") %>',
                'api_base_url': '<%= grunt.config.get("api_base_url") %>',
                'timestamp': '<%= grunt.config.get("cacheBuster") %>'
              },
              force: true,
              detail: true
            },
            files: [
              {src: ['modules/main/config.tpl.js'], dest: 'modules/main/config.js'},
              {src: ['modules/main/index.tpl.html'], dest: 'www/index.html'}
            ]
          }
        },
        jshint: {
            options: {
                browserify: true,
                browser: true,
                devel: true
            },
            all: [
                'Gruntfile.js',
                'modules/**/*.js'
            ]
        },
        simplemocha: {
            all: [
                'tests/test-suite.js',
            ]
        },
        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            configFiles: {
                files: ['Gruntfile.js'],
                tasks: ['build'],
                options: {
                    reload: true
                }
            },
            js: {
                files: [
                    'modules/**/*.js',
                    'vendor/**/*'
                ],
                tasks: ['build']
            },
            tpl: {
                files: [
                    'modules/**/*.html'
                ],
                tasks: ['browserify:dev']
            },
            css: {
                files: ['modules/**/*.less'],
                tasks: ['less']
            },
        },
        less: {
            dist: {
                files: {
                    'www/style.css': 'modules/main/_style.less'
                },
                options: {
                    compress: false,
                    sourceMap: true,
                    sourceMapFilename: 'www/style.css.map',
                    sourceMapURL: 'style.css.map'
                }
            }
        },
        connect: {
            server: {
                options: {
                    base: 'www',
                    open: true,
                    livereload: true
                }
            }
        },
        browserify: {
            dev: {
                src: ['modules/**/*.js'],
                dest: 'www/index.js',
                options: {
                    browserifyOptions: {
                        debug: true // Enable (inline) source map
                    }
                }
            },
            test: {
                src: ['tests/**/*_spec.js'],
                dest: 'tests/test-suite.js'
            },
            options: {
                transform: [
                    ['node-underscorify', {
                        templateSettings: {variable: 'data'},
                        requires: [
                            {variable: '_', module: 'lodash'},
                            {variable: 'i18n', module: 'i18next-client'}
                        ]
                    }]
                ]
            }
        },
        uglify: {
            dist: {
                src: ['www/index.js'],
                dest: 'www/index.js'
            }
        },
        copy: {
            fonts: {
                expand: true,
                src: ['./node_modules/bootstrap/fonts/glyphicons-halflings-regular.*'],
                dest: 'www/fonts/',
                flatten: true
            }
        },
        clean: [
            'www/style.css',
            'www/style.css.map',
            'www/index.js',
            'tests/test-suite.js',
            'www/fonts/glyphicons-halflings-regular.*'
        ]
    });

    grunt.loadNpmTasks('grunt-config');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['jshint', 'browserify:test', 'simplemocha']);
    grunt.registerTask('build', ['test', 'less', 'browserify:dev', 'copy']);
    grunt.registerTask('preprod', ['config:preprod', 'replace', 'build']);
    grunt.registerTask('dev', ['config:dev', 'replace', 'build']);
    grunt.registerTask('live', ['dev', 'connect', 'watch']);
    grunt.registerTask('default', ['config:prod', 'replace', 'build', 'uglify']);
};
