var gulp = require('gulp');
var exec = require('child-process-promise').exec;
var yargs = require('yargs');

const argv = yargs.argv;

/*
  Tasks
*/
gulp.task('docs', docsTask);

function docsTask(done) {
  var script = require.resolve('gitbook-cli/bin/gitbook.js');
  var cmd = '"' + process.execPath + '"';
  
  exec([cmd, script, 'install', './'].join(' ')).then(() => {
    return exec([cmd, script, argv.watch ? 'serve' : 'build', './', './dist/docs'].join(' '));
  }).then(() => {
    done();
  }).catch((err) => {
    done(new Error(err.stdout || err));
  })
}
