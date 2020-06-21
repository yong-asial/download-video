#!/usr/bin/env node
"use strict";

const fs = require('fs');
const youtubedl = require('youtube-dl');
const path = require('path');

const args = process.argv;
const url = args[2];
const filename = args[3] || 'video.mp4';
const output = path.resolve(filename);

if (!url) {
  console.log('input your Youtube Url');
  process.exit(1);
}

const video = youtubedl(url,
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname })
 
// Will be called when the download starts.
video.on('info', function(info) {
  console.log('Download started')
  console.log('filename: ' + info._filename)
  console.log('size: ' + info.size)
});
video.on('end', () => {
  console.log(`\nThe downloaded file is stored here: ${output}\n`);
});

video.pipe(fs.createWriteStream(output))