'use strict';

var exec = require('child_process').exec,
  fs = require('fs'),
  grunt = require('grunt'),
  path = require('path');

var TEST_APP = 'grunt-titanium-app',
  appPath = path.resolve('tmp', TEST_APP);

exports.titanium = {
  setUp: function(done) {
    grunt.file.mkdir(path.resolve('tmp'));
    done();
  },
  should_create: function(test) {
    test.expect(3);

    test.ok(grunt.file.exists(path.join(appPath, 'tiapp.xml')));
    test.ok(grunt.file.exists(path.join(appPath, 'Resources')));
    test.ok(grunt.file.exists(path.join(appPath, 'Resources', 'app.js')));

    test.done();
  },
  should_build: function(test) {
    test.expect(4);

    test.ok(grunt.file.exists(path.join(appPath, 'build')));
    if (process.platform === 'darwin') {
      test.ok(grunt.file.exists(path.join(appPath, 'build', 'iphone')));
      test.ok(grunt.file.exists(path.join(appPath, 'build', 'iphone', TEST_APP + '.xcodeproj')));
      test.ok(grunt.file.exists(path.join(appPath, 'build', 'iphone', 'build', TEST_APP + '.build')));
    } else {
      test.ok(grunt.file.exists(path.join(appPath, 'build', 'android')));
      test.ok(grunt.file.exists(path.join(appPath, 'build', 'android', 'bin')));
      test.ok(grunt.file.exists(path.join(appPath, 'build', 'android', 'bin', TEST_APP + '.apk')));
    }

    test.done();
  },
  should_project: function(test) {
    test.expect(0);

    // titanium CLI does not yet support setting values via "ti project"

    test.done();
  },
  should_config: function(test) {
    test.expect(4);

    var bin = '"' + path.join(__dirname, '..', 'node_modules', '.bin', 'titanium') + '"';
    exec(bin + ' config grunt.titanium', function(err, stdout) {
      test.ok(!err);
      test.ok(stdout);
      test.ok(stdout.trim() === '1');

      exec(bin + ' config grunt.titanium --remove', function(err, stdout) {
        test.ok(!err);
        test.done();
      });
    });
  },
  should_version_local: function(test) {
    test.expect(1);

    var v = fs.readFileSync(path.resolve('tmp', 'tmp.txt'), 'utf8').trim();
    test.equal(v, process.env.TI_VERSION_LOCAL);

    test.done();
  },
  should_version_global: function(test) {
    test.expect(1);

    var v = fs.readFileSync(path.resolve('tmp', 'tmp_global.txt'), 'utf8').trim();
    test.equal(v, process.env.TI_VERSION_GLOBAL);

    test.done();
  }
};
