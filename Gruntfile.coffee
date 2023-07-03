#global module:false

"use strict"

module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-shell"
  grunt.loadNpmTasks "grunt-browser-sync"
  grunt.loadNpmTasks "grunt-jekyll"

  grunt.initConfig
    copy:
      jquery:
        files: [{
          nonull: true
          expand: true
          cwd: "node_modules/jquery/dist/"
          src: "jquery.min.js"
          dest: "vendor/js/"
        }]
      misc:
       files: [
          {
            nonull: true
            expand: true
            cwd: "node_modules/rpg-awesome/css/"
            src: "rpg-awesome.min.css"
            dest: "vendor/css/"
          },
          {
            nonull: true
            expand: true
            cwd: "node_modules/rpg-awesome/fonts/"
            src: "*"
            dest: "vendor/fonts/"
          },
       ]

    shell:
      jekyll:
        command: "bundle exec jekyll build --trace"
      jekyllIncr:
        command: "bundle exec jekyll build --trace --incremental"
      graphsXho:
        command: 'python _scripts/sessionstats.py multi _xho/sessions -o "assets/img/gen/" -P xho --dpi 150 --colorseed 220'
      graphsStar:
        command: 'python _scripts/sessionstats.py multi _star/sessions -o "assets/img/gen/" -P star --dpi 150 --colorseed 523'
      recapsXho:
        command: 'python _scripts/generate_gpt_recap.py xho'
      recapsStar:
        command: 'python _scripts/generate_gpt_recap.py star'

    watch:
      options:
        livereload: true
        interrupt: true
      source:
        files: [
          "_drafts/**/*"
          "_includes/**/*"
          "_layouts/**/*"
          "_posts/**/*"
          "_plugins/**"
          "_sass/**"
          "_data/**"
          "_scripts/**"
          "_xho/**"
          "_star/**"
          "_config.yml"
          "assets/css/**"
          "assets/js/**"
          "assets/img/*"
          "assets/img/pg/**"
          "**.html"
          "*.md"
          "xho/**"
          "star/**"
          "homebrew/**"
          "Gruntfile.coffee"
        ]
        tasks: [
          "runscripts"
          "shell:jekyll"
        ]
    browserSync:
      dev:
        bsFiles:
          src : [
            '_site/**/*.*'
          ]
        options:
          port: 4000
          watchTask: true,
          server: './_site'
          extensions: ['html']

    jekyll:
      options:
        bundleExec: true
      serve:
        options:
          serve: true,
          skip_initial_build: true
          livereload: true
          host: "0.0.0.0"

  grunt.registerTask "runscripts", [
    "shell:graphsStar"
    "shell:graphsXho"
    "shell:recapsXho"
    "shell:recapsStar"
  ]

  grunt.registerTask "build", [
    "runscripts"
    "copy"
    "shell:jekyll"
  ]

  grunt.registerTask "serveReload", [
    "build"
    "browserSync"
    "watch"
  ]

  grunt.registerTask "serve", [
    "build"
    "jekyll:serve"
  ]

  grunt.registerTask "default", [
    "serve"
  ]