'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'], 
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/modules/**/*.css'],
		mochaTests: ['app/tests/**/*.js'],
		protractor: ['tests/front/e2e/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		shell: {
      options: {
        stdout: true
      },
      selenium: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager start',
        options: {
          stdout: false,
          async: true
        }
      },
      protractor_install: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager update'
      },
      npm_install: {
        command: 'npm install'
      }
    },
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			protractor: {
        files: watchFiles.clientJS.concat(watchFiles.protractor),
        tasks: ['protractor:auto'],
        options: {
        	livereload: 53916
        }
      }
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
    ngmin: {
        production: {
            files: {
                'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
            }
        }
    },
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
        configFile: './tests/front/karma.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './tests/front/karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
      unit_coverage: {
        configFile: './tests/front/karma.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'public/modules/**/*.js': ['coverage']
        },
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      },
		},
		protractor: {
			options: {
        keepAlive: true,
        configFile: './tests/front/protractor.conf.js'
      },
      singlerun: {},
      auto: {
        keepAlive: true,
        options: {
          args: {
            seleniumPort: 4444
          }
        }
      }
		},
		open: {
      coverage: {
        path: 'http://localhost:5555'
      }
    },
    connect: {
    	coverage: {
    		options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
    	}
    }
	});

	// Load NPM tasks 
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngmin', 'uglify', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit_auto']);
	
	grunt.registerTask('serve', ['nodemon']);

	//single run tests
  grunt.registerTask('test:front', ['jshint','test:front_unit', 'test:front_e2e']);
  grunt.registerTask('test:front_unit', ['env:test', 'karma:unit']);
  grunt.registerTask('test:front_e2e', ['env:test','protractor:singlerun']);

  //autotest and watch tests
  grunt.registerTask('autotest:front', ['env:test', 'karma:unit_auto']);
  grunt.registerTask('autotest:front_unit', ['env:test','karma:unit_auto']);
  grunt.registerTask('autotest:front_e2e', ['env:test','shell:selenium','watch:protractor']);

  //coverage testing
  grunt.registerTask('test:coverage', ['env:test','karma:unit_coverage']);
  grunt.registerTask('coverage', ['env:test','karma:unit_coverage','open:coverage','connect:coverage']);
};
