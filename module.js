/*jslint maxlen: 140, unused: false */

var dir = __dirname,
    scripts_dir = dir + '/scripts',
    styles_dir = dir + '/styles',
    // images_dir = dir + '/images',
    // tests_dir = dir + '/test',
    build_dir = dir + '/lib/assets',
    grunt = {
        'watch': [{
            'js': {
                'files': [scripts_dir + '/*.js'],
                'tasks': ['closureCompiler:refinerycms-epiceditor_js',
                            'concat:refinerycms-epiceditor_js',
                            'copy:refinerycms-epiceditor_js',
                            'livereload']
            },
            'styles': {
                'files': [styles_dir + '/{,*/}*.css', styles_dir + '/{,*/}*.css.scss'],
                'tasks': ['assetUrl:refinerycms-epiceditor_styles', 'copy:refinerycms-epiceditor_styles']
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
                                    'externs/refinery_object.js',
                                    'externs/refinery-admin.js',
                                    dir + '/externs/epiceditor.js'
                                    ],
                        'language_in': 'ECMASCRIPT5_STRICT',
                        'summary_detail_level': 3,
                        'output_wrapper': '"(function(window, $){%output%}(window, jQuery));"'
                    }
                },
                'src': [
                    'scripts/*.js'
                ],
                'dest': '.tmp/assets/javascripts/epiceditor.min.js'
            }
        }],

        'concat': [{
            'js': {
                'src': [
                    'scripts/*.js'
                ],
                'dest': '.tmp/assets/javascripts/epiceditor.all.js'
            }
        }],

        'copy': [{
            'js': {
                'files': [{
                    'expand': true,
                    'dot': true,
                    'cwd': dir + '/.tmp/assets/javascripts/',
                    'dest': build_dir + '/javascripts/refinery/epiceditor/',
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
                    'cwd': dir + '/.tmp/assets/stylesheets/',
                    'dest': build_dir + '/stylesheets/refinery/epiceditor/',
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
                    'dest': build_dir + '/javascripts/refinery/i18n/epiceditor/',
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
