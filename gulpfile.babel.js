import gulp     from 'gulp';
import git      from 'gulp-git';
let guppy = require('git-guppy')(gulp);
import bump     from 'gulp-bump';
import webpack  from 'webpack';
import path     from 'path';
import rename   from 'gulp-rename';
import template from 'gulp-template';
import jeditor  from 'gulp-json-editor';
import yargs    from 'yargs';
import gutil    from 'gulp-util';
import serve    from 'browser-sync';
import del      from 'del';
import rp       from 'request-promise';
import protractorLib        from 'gulp-protractor';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported      from 'supports-color';
import historyApiFallback   from 'connect-history-api-fallback';

let root = 'client';

const protractor = protractorLib.protractor;


// helper method for resolving paths
let resolveToApp = (glob = '') => {
  return path.join(root, 'app', glob); // app/{glob}
};

let resolveToComponents = (glob = '') => {
  return path.join(root, 'app/components', glob); // app/components/{glob}
};

// map of all paths
let paths = {
  js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
  scss: resolveToApp('**/*.scss'), // stylesheets
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, root, 'app/appMockBackEnd.js')
  ],
  output: root,
  blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
  dest: path.join(__dirname, 'dist')
};



// use webpack.config.js to build modules
gulp.task('webpack', ['clean'], (cb) => {

  // Phase is used by Bugsnag to know if the error happened on UAT (default) or PROD
  let phase = yargs.argv.phase || 'UAT';

  const config = require('./webpack.dist.config')(phase);
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});

gulp.task('setKarmaGlobals', () => {

  let browser = yargs.argv.browser || 'Chrome';

  gutil.log("browser=", browser);

  gulp.src("./karmaGlobals.json")
    .pipe(jeditor({
      'browser': browser
    }))
    .pipe(gulp.dest("."));
});


gulp.task('e2e_test', () => {

  let baseUrl = yargs.argv.baseUrl || 'http://127.0.0.1:3000/';

  let launchE2ETesting = () => {
    return gulp.src([
      './e2eTesting/Cycle1_module1.spec.js',
      './e2eTesting/Cycle1_module2.spec.js'
    ])
    .pipe(protractor({
      configFile: "./protractor.conf.js",
      args: ['--baseUrl', baseUrl]
    }))
    .on('error', (e) => {
      throw e
    });
  };

  if ( baseUrl !== 'http://127.0.0.1:3000/' ) {
    let options = {
      uri: 'https://apipl.ciprianspiridon.com/tonio-user',
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    return rp(options)
    .then( () => {
      gutil.log('User successfully reseted to Cycle 1 - Module 1 - Step 2');
      return launchE2ETesting();
    })
    .catch( (err) => {
      gutil.log('Error resetting User to Cycle 1 - Module 1 - Step 2 / Abort E2E testing');
      // API call failed...
      return err;
    });
  }
  else {
    return launchE2ETesting();
  }


});

gulp.task('serve', () => {
  const config = require('./webpack.dev.config')();
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    // application entry point
  ].concat(paths.entry);

  const compiler = webpack(config);

  serve({
    port: process.env.PORT || 3000,
    open: true,
    server: {baseDir: root},
    middleware: [
      historyApiFallback(),
      webpackDevMiddleware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpackHotMiddleware(compiler, {
        log: () => {},
        heartbeat: 2000
      })
    ]
  });
});

gulp.task('watch', ['serve']);

gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToComponents(), parentPath, name);

  let reDetectUpperCase = new RegExp('[A-Z]', 'g');
  let convertUppercase = (matchSubString, offset, wholeString) => {
    let returnString = '';
    if ( offset > 0 ) {
      // add '-' only if it is not the first letter in the word
      returnString += '-';
    }
    returnString += matchSubString.toLowerCase()
    return returnString;
  };

  return gulp.src(paths.blankTemplates)
    .pipe(template({
      name: name,
      dashCaseName: name.replace(reDetectUpperCase, convertUppercase),
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
});

gulp.task('bumpVersion', () => {
  gutil.log('Bump package json version');
  return gulp.src('./package.json')
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'))
  .pipe(git.commit('bump version'));
});

gulp.task('pre-commit', guppy.src('pre-commit', (files) => {
  gutil.log('pre-commit hook files=', files);
  // if ( files.length !== 1 || files[0] !== 'package.json' ) {
  //
  //   gutil.log('trigger bumpVersion');
  //   // This pre-commit hook is NOT triggered by bumpVersion above, bump version of package.json
  //   // if it would have been triggered by bumpVersion (because we commit a file during bumpVersion, so it triggers this hook)
  //   // we don't want to call bumpVersion to avoid infinite loop
  //   gulp.start('bumpVersion');
  // }
  // else {
  //
  //   gutil.log('DONT trigger bumpVersion because its only package.json');
  // }
}));

gulp.task('post-commit', guppy.src('post-commit', (files) => {
  gutil.log('post-commit hook files=', files);
  if ( files.length !== 1 || files[0] !== 'package.json' ) {

    gutil.log('trigger bumpVersion');
    // This pre-commit hook is NOT triggered by bumpVersion above, bump version of package.json
    // if it would have been triggered by bumpVersion (because we commit a file during bumpVersion, so it triggers this hook)
    // we don't want to call bumpVersion to avoid infinite loop
    gulp.start('bumpVersion');
  }
  else {

    gutil.log('DONT trigger bumpVersion because its only package.json');
  }
}));


// Every time there is a push to the repository, the version in package.json will be bumped
gulp.task('pre-push', ['bumpVersion'], guppy.src('pre-push', (files) => {
  gutil.log('pre-push hook files=', files);
}));



gulp.task('default', ['watch']);
