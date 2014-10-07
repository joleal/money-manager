'use strict';

module.exports = {
	app: {
		title: 'Money Manager',
		description: 'Application to manage expenses and budget',
		keywords: 'Finance, Money, Budget'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'this is not a secret',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: {
			unit: [
				'public/lib/angular-mocks/angular-mocks.js',
				'tests/front/unit/*.js'
			],
			e2e: [
				'tests/front/e2e/*.js'
			]
		}
	}
};
