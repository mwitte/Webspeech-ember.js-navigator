// Generated on 2013-11-23 using generator-ember 0.7.1
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        watch: {
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'src/**'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                protocol: 'http',
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'src')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: '<%= connect.options.protocol %>://<%= connect.options.hostname %>:<%= connect.options.port %>'
            }
        }
    });

    grunt.registerTask('server', function (target) {

        grunt.task.run([
            'connect:livereload',
            'open',
            'watch:livereload'
        ]);
    });

    grunt.registerTask('default', [
        //'jshint',
        'test',
        'build'
    ]);
};
