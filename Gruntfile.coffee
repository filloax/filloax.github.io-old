#global module:false

"use strict"

module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-exec"
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

    exec:
      jekyll:
        cmd: "bundle exec jekyll build --trace"

    watch:
      options:
        livereload: true
      source:
        files: [
          "_drafts/**/*"
          "_includes/**/*"
          "_layouts/**/*"
          "_posts/**/*"
          "css/**/*"
          "js/**/*"
          "_config.yml"
          "*.html"
          "*.md"
        ]
        tasks: [
          "exec:jekyll"
        ]

    jekyll:
      options:
        bundleExec: true
      serve:
        options:
          serve: true,
          skip_initial_build: true
          livereload: true
          host: "0.0.0.0"



  grunt.registerTask "build", [
    "copy"
    "exec:jekyll"
  ]

  grunt.registerTask "serve", [
    "build"
    "jekyll:serve"
    "watch"
  ]

  grunt.registerTask "default", [
    "serve"
  ]