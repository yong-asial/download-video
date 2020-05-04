#!/usr/bin/env node
"use strict";

const readline = require('readline');
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');

const main = () => {
  const args = process.argv;
  const defaultVideo = 'https://www.youtube.com/watch?v=or6P6G_YX1I';
  const defaultFilename = 'video.mp4';
  if (!args || !args.length || args.length < 3) {
    console.error('Invalid argument');
    console.log(`> download-video ${defaultVideo}`);
    console.log(`> download-video ${defaultVideo} ${defaultFilename}`);
    return;
  }

  const url = args[2];
  const filename = args[3] || defaultFilename;
  const output = path.resolve(filename);
  
  const video = ytdl(url);
  let starttime;
  video.pipe(fs.createWriteStream(output));
  video.once('response', () => {
    starttime = Date.now();
  });
  video.on('progress', (chunkLength, downloaded, total) => {
    const percent = downloaded / total;
    const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
    const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
    process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
    process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)} minutes`);
    process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
    readline.moveCursor(process.stdout, 0, -1);
  });
  video.on('end', () => {
    process.stdout.write(`\nThe downloaded file is stored here: ${output}\n`);
  });
  video.on('error', (error) => {
    process.stdout.write(`\nDownload Failed.\n`);
    console.log(error);
  });

}

main();