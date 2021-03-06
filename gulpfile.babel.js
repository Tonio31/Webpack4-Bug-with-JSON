import gulp     from 'gulp';
import git      from 'gulp-git';
import bump     from 'gulp-bump';
import webpack  from 'webpack';
import path     from 'path';
import rename   from 'gulp-rename';
import template from 'gulp-template';
import yargs    from 'yargs';
import gutil    from 'gulp-util';
import serve    from 'browser-sync';
import del      from 'del';
import rp       from 'request-promise';
import tag_version          from 'gulp-tag-version';
import protractorLib        from 'gulp-protractor';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported      from 'supports-color';
import historyApiFallback   from 'connect-history-api-fallback';
import awspublish           from 'gulp-awspublish';
import cloudFront           from 'gulp-cloudfront-invalidate-aws-publish';

let root = 'client';

const protractor = protractorLib.protractor;

let commonAwsConf = {
  buildSrc: {
    index: [ './dist/index.html' ],
    allButIndex: [
      './dist/**/*',
      '!./dist/index.html'
    ]
  },
  headers: {
    index: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    },
    allButIndex: {
      'Cache-Control': 'max-age=31536000, no-transform, public'
    },
  },
  region: 'eu-west-2',
};

let awsConf = {
  UAT: {
    deployUrl: 'https://test-program.potentialife.com',
    s3: {
      buildSrc: commonAwsConf.buildSrc,
      keys: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: commonAwsConf.region,
        params: {
          Bucket: 'test.program.potentialife.com'
        }
      },
      headers: commonAwsConf.headers
    },
    cloudFront: {
      distribution: 'E3N0OB6AFVAPFJ', // Cloudfront distribution ID
      accessKeyId: process.env.S3_ACCESS_KEY_ID, // Optional AWS Access Key ID
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, // Optional AWS Secret Access Key
      wait: true,                     // Whether to wait until invalidation is completed (default: false)
      indexRootPath: true             // Invalidate index.html root paths (`foo/index.html` and `foo/`) (default: false)
    }
  },
  PROD: {
    deployUrl: 'https://program.potentialife.com',
    s3: {
      buildSrc: commonAwsConf.buildSrc,
      keys: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: commonAwsConf.region,
        params: {
          Bucket: 'program.potentialife.com'
        }
      },
      headers: commonAwsConf.headers
    },
    cloudFront: {
      distribution: 'ELTZC5FGWC0Q', // Cloudfront distribution ID
      accessKeyId: process.env.S3_ACCESS_KEY_ID, // Optional AWS Access Key ID
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, // Optional AWS Secret Access Key
      wait: true,                     // Whether to wait until invalidation is completed (default: false)
      indexRootPath: true             // Invalidate index.html root paths (`foo/index.html` and `foo/`) (default: false)
    }
  }
};

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
    '@babel/polyfill',
    path.join(__dirname, root, 'app/appMockBackEnd.js')
  ],
  output: root,
  blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
  dest: path.join(__dirname, 'dist')
};


gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
});


// use webpack.config.js to build modules
gulp.task('webpack', gulp.series('clean', (cb) => {

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
}));

gulp.task('e2e_test', () => {

  let baseUrl = yargs.argv.baseUrl || 'http://127.0.0.1:3000/';
  gutil.log(`Launch e2e Test on: ${baseUrl}`);

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

gulp.task('serve', (done) => {
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

  done();
});

gulp.task('watch', gulp.series('serve'));

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

gulp.task('tagRepo', () => {
  gutil.log('create a git Tag');
  return gulp.src(['./package.json'])
  .pipe(tag_version());
});

// Push tag to current branch
gulp.task('pushTag', gulp.series('tagRepo', (done) => {
  gutil.log('push a git Tag');
  git.push('origin', '', {args: ' --tags'}, function(err) { if (err) throw err;});
  done();
}));

gulp.task('bumpVersionNumber', () => {
  return gulp.src('./package.json')
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'))
  .pipe(git.add())
  .pipe(git.commit('[skip ci] - Bump and tag package.json version'));
});

gulp.task('pushVersionNumber', gulp.series('bumpVersionNumber', (done) => {
  gutil.log('gitPush will Increment package.json version, commit and push');
  git.push('origin', '', {args: ''}, function(err) { if (err) throw err;});
  done();
}));

gulp.task('default', gulp.series('watch'));

gulp.task('deployAllButIndex', gulp.series( () => {

  let phase = yargs.argv.phase || 'UAT';

  let conf = awsConf[ phase ];

  let publisher = awspublish.create( conf.s3.keys );

  gutil.log( `Deploy dist(all but index.html) folder into ${phase} S3-Bucket: ${conf.s3.keys.params.Bucket}` );
  gutil.log( 'Headers to be added to the files: ', conf.s3.headers.allButIndex );

  return gulp.src( conf.s3.buildSrc.allButIndex )
  .pipe( awspublish.gzip( { ext: '' } ) )
  .pipe( publisher.publish( conf.s3.headers.allButIndex ) )
  .pipe( publisher.sync() )
  .pipe( publisher.cache() )
  .pipe( awspublish.reporter() );

}));

gulp.task('deployIndex', gulp.series( 'deployAllButIndex', () => {

  let phase = yargs.argv.phase || 'UAT';

  let conf = awsConf[ phase ];

  let publisher = awspublish.create( conf.s3.keys );

  gutil.log( `Deploy dist/index.html file into ${phase} S3-Bucket: ${conf.s3.keys.params.Bucket}` );
  gutil.log( 'Headers to be added to index.html: ', conf.s3.headers.index );
  gutil.log( 'Invalidate Files on CloudFront With Distribution ID=', conf.cloudFront.distribution );

  return gulp.src( conf.s3.buildSrc.index )
  .pipe( awspublish.gzip( { ext: '' } ) )
  .pipe( publisher.publish( conf.s3.headers.index ) )
  .pipe( cloudFront( conf.cloudFront ) )
  .pipe( publisher.cache() )
  .pipe( awspublish.reporter() );
}));

gulp.task('deploy', gulp.series( 'deployIndex', (done) => {
  let phase = yargs.argv.phase || 'UAT';

  let versionNumber = require( './package.json' ).version;

  let slack = require('gulp-slack')({
    url: 'https://hooks.slack.com/services/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',
    channel: '#deployments',
    user: 'Frankie Program',
    icon_emoji: ':shipit:'
  });

  slack( `PROGRAM: Deployment on ${phase} - v${versionNumber}: ${awsConf[ phase ].deployUrl}` );
  done();
}));

gulp.task('notifyTicketsChanel', (done) => {

  let phase = yargs.argv.phase || 'UAT';

  gutil.log('phase=', phase);

  let slack = require('gulp-slack')({
    url: 'https://hooks.slack.com/services/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',
    channel: '#tickets', // Optional
    user: 'Automating Deployment', // Optional
    icon_emoji: ':potentialife:' // Optional
  });

  slack(`A new version of the Front End has been pushed on ${phase}, be aware for incoming tickets`);
  done();
});


