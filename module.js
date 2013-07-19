/*jslint maxlen: 140, unused: false */

var dir = __dirname,
    scripts_dir = dir + '/scripts',
    styles_dir = dir + '/styles',
    // images_dir = dir + '/images',
    // tests_dir = dir + '/test',
    build_dir = dir + '/lib/assets',
    grunt = {
        'watch' : [{
            'js' : {
                'files': [scripts_dir + '/*.js'],
                'tasks': ['closureCompiler:refinery-epiceditor_js',
                            'concat:refinery-epiceditor_js',
                            'copy:refinery-epiceditor_js',
                            'livereload']
            },
            'styles' : {
                'files': [styles_dir + '/{,*/}*.css', styles_dir + '/{,*/}*.css.scss'],
                'tasks': ['copy:refinery-epiceditor_styles']
            }
        }],
        'closureCompiler': [{
            'js': {
                'options': {
                    'checkModified': true,
                    'compilerOpts': {
                        'compilation_level': 'ADVANCED_OPTIMIZATIONS',
                        //'formatting': 'PRETTY_PRINT',
                        'warning_level': 'verbose',
                        'externs': ['externs/jquery-1.9.js',
                                    'externs/custom.js',
                                    'externs/refinery.js',
                                    'externs/refinery-admin.js',
                                    dir + '/externs/epiceditor.js'
                                    ],
                        'language_in': 'ECMASCRIPT5_STRICT',
                        'summary_detail_level': 3,
                        'output_wrapper': '"(function(window, $, refinery){%output%}(window, jQuery, window.refinery));"'
                    }
                },
                'src': [
                    'scripts/*.js'
                ],
                'dest': '.tmp/assets/javascripts/refinery/refinery-epiceditor.min.js'
            }
        }],

//        clean: [{
//            base: {
//                files: [{
//                    dot: true,
//                    src: [
//                        dir + '/.tmp'
//                    ]
//                }]
//            }
//        }],
//
        'concat': [{
            'js' : {
                'src': [
                    'scripts/*.js'
                ],
                'dest': '.tmp/assets/javascripts/refinery/refinery-epiceditor.all.js'
            }
        }],

        'copy': [{
            'js': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/.tmp/assets/javascripts/',
                    'dest': build_dir + '/javascripts/',
                    'src': [
                        '**'
                    ]
                }]
            }
        }, {
            'styles': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/styles/',
                    'dest': build_dir + '/stylesheets/refinery/',
                    'src': [
                        '**'
                    ]
                }]
            }
        }, {
            'i18n': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/i18n/',
                    'dest': build_dir + '/javascripts/refinery/i18n/',
                    'src': [
                        '*.js'
                    ]
                }]
            }
        }, {
            'epiceditor': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/components/EpicEditor/epiceditor/js/',
                    'dest': build_dir + '/javascripts/vendor/epiceditor/',
                    'src': [
                        '*.js'
                    ]
                }]
            }
        }]
    };

exports.grunt = grunt;
