/*jslint maxlen: 120 */

'use strict';
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// var fs = require('fs');
var src_path = __dirname;
var compiler_path = process.env.CLOSURE_COMPILER_JAR || 'tools/closure-compiler/compiler.jar';
var build_dir = __dirname + '/lib/assets';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var gruntConfig = {
        watch: {
            coffee_test: {
                files: ['test/{,*/}*.coffee', 'test/{,**/}*.coffee'],
                tasks: ['coffee:test']
            },
            base_js: {
                files: ['scripts/*.js'],
                tasks: ['closureCompiler:base_js',
                            'concat:base_js',
                            'copy:js']
            },
            styles: {
                files: ['styles/{,*/}*.css', 'styles/{,*/}*.css.scss'],
                tasks: ['assetUrl:styles', 'copy:styles']
            }
        },
        concurrent: {
            server: [
                'coffee'
            ],
            test: [
                'coffee'
            ]
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            proxies: [
                {
                    context: '/',
                    host: 'localhost',
                    port: 3000,
                    https: false,
                    changeOrigin: false
                }
            ],
            server: {
                options: {
                    keepalive: false,
                    middleware: function (connect, options) {
                        return [
                            mountFolder(connect, '.'),
                            mountFolder(connect, '.tmp'),
                            connect.directory(options.base)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    //keepalive: false,
                    middleware: function (connect, options) {
                        return [
                            mountFolder(connect, '.'),
                            mountFolder(connect, '.tmp'),
                            connect.directory(options.base)
                        ];
                    }
                }
            },
            rails: {
                options: {
                    keepalive: false,
                    middleware: function (connect) {
                        return [
                            proxySnippet,
                            mountFolder(connect, '.'),
                            mountFolder(connect, '.tmp')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'scripts/*.js'
            ]
        },

        mocha: {
            all: {
                options: {
                    log: true,
                    run: true,
                    urls: [
                        'http://localhost:9001/test/e2e/devel.html'
                    ]
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp'
                    ]
                }]
            }
        },

        assetUrl: {
            styles: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'styles/',
                    dest: '.tmp/assets/stylesheets/',
                    src: [
                        '*.scss', '*.css', '**/*.scss', '**/*.css'
                    ]
                }]
            }
        },

        concat: {
            options : {
                banner: '' +
                        '\n(function (window, $) {\n',
                footer: '\n}(window, jQuery));',
                process : function (src, filepath) {
                    src = src.replace(/\/\*jslint.+\*\/\n/, '');
                    src = src.replace(/\/\*jshint.+\*\/\n/, '');
                    src = src.replace(/\/\*global.+\*\/\n/, '');
                    src = src.replace(/(^|\s+)'use strict';/, '');
                    src = src.replace(/^\n+/, '');
                    src = src.replace(/\n+$/, '');
                    return '\n// Source: ' + filepath.replace(src_path + '/', '') + '\n' + src;
                }
            },

            base_js: {
                src: [
                    'scripts/epiceditor.js'
                ],
                dest: '.tmp/assets/javascripts/epiceditor.all.js'
            }
        },

        closureCompiler: {
            options: {
                compilerFile: compiler_path,
                checkModified: true,
                compilerOpts: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    warning_level: 'verbose',
                    externs: [
                        'components/refinerycms-clientside/externs/jquery-1.9.js',
                        'components/refinerycms-clientside/externs/custom.js',
                        'components/refinerycms-clientside/externs/refinery.js',
                        'components/refinerycms-clientside/externs/refinery_object.js',
                        'components/refinerycms-clientside/externs/refinery-admin.js',
                        'externs/epiceditor.js'
                    ],
                    summary_detail_level: 3,
                    language_in: 'ECMASCRIPT5_STRICT',
                    // for debug
                    //formatting: 'PRETTY_PRINT',
                    output_wrapper: '"(function(window, $){%output%}(window, jQuery));"'
                }
            },

            base_js: {
                src: [
                    'scripts/epiceditor.js'
                ],
                dest: '.tmp/assets/javascripts/epiceditor.min.js'
            }
        },

        coffee: {
            test: {
                files: [{
                    expand: true,
                    src: ['text/{,*/}*.coffee', 'test/{,**/}*.coffee'],
                    ext: '.js'
                }]
            }
        },

        copy: {
            js: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp/assets/javascripts/',
                    dest: build_dir + '/javascripts/refinery/',
                    src: [
                        '**'
                    ]
                }]
            },
            styles: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp/assets/stylesheets/',
                    dest: build_dir + '/stylesheets/refinery/',
                    src: [
                        '**'
                    ]
                }]
            },
            i18n: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'i18n/',
                    dest: build_dir + '/javascripts/refinery/i18n/',
                    src: [
                        '**'
                    ]
                }]
            }
        }
    };

    grunt.initConfig(gruntConfig);

    grunt.registerTask('server', function (target) {
        if (target === 'rails') {
            return grunt.task.run([
                'build',
                'concurrent:server',
                'configureProxies',
                'connect:rails',
                'open:server',
                'watch'
            ]);
        }

        grunt.task.run([
            'build',
            'concurrent:server',
            'connect:server',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'jshint',
        'concurrent:test',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean',
        'concat',
        'closureCompiler',
        'assetUrl',
        'copy',
        'noop'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);

    // for debug build scripts, do nothing
    grunt.registerTask('noop', function () { });

    grunt.task.registerMultiTask('assetUrl', function() {
        var files = this.files,
            len = this.filesSrc.length,
            obj, file;

        for (var i = 0; i < len; i++) {
            if (grunt.file.isFile(this.filesSrc[i])) {
                obj = files[i];
                file = grunt.file.read(obj.src[0]);

                grunt.file.write(obj.dest,
                    file.replace(/ url\('\/images/g, ' asset-url(\'refinery'));
            }
        }
    });
};
