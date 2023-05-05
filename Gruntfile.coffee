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
      att_xho:
        cmd: 'python _scripts/countplayers.py _xho/sessions -s -o "assets/img/gen/xho_attendance.webp" --dpi 150'
      att_star:
        cmd: 'python _scripts/countplayers.py _star/sessions -s -o "assets/img/gen/star_attendance.webp" --dpi 150 --colorseed 523'

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
          "runscripts"
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

  grunt.registerTask "runscripts", [
    "exec:att_star"
    "exec:att_xho"
  ]

  grunt.registerTask "build", [
    "runscripts"
    "copy"
    "exec:jekyll"
  ]

  grunt.registerTask "serve", [
    "build"
    "jekyll:serve"
    "watch"
  ]

  grunt.registerTask "servetrace", [
    "build"
    "jekyll:serve"
    "watch"
  ]

  grunt.registerTask "default", [
    "serve"
  ]