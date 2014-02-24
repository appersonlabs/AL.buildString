/*
 * plugins.js: Titanium CLI plugins hook
 *
 * Copyright (c) 2012, Appcelerator, Inc.  All Rights Reserved.
 * See the LICENSE file for more information.
 */
var exec = require('child_process').exec;
var fs = require('fs');

exports.cliVersion = '>=3.X';
var PS = '/';

exports.init = function (logger, config, cli) {

    cli.addHook('build.pre.compile', function (data, finished) {
        var tag,
            cleanTree = true,
            dirtyBranch = "",
            currentBranch = "",
            gitHash = "";

        if(!data.cli) {
            data = cli;
        }

        // is this a *nix system?
        if( (data.cli && data.cli.sdk.path.indexOf("/") === -1) || (data.env && data.env.commands.sdk.indexOf("/") === -1) ) {
            // this is a windows box... change the pathSeperator
            PS = '\\';
        }

        exec("git describe --abbrev=0 --tags", function(error, stdout, stderr) {
            tag = stdout.trim();

            exec("git diff --exit-code", function(error, stdout, stderr) {
                if(stdout.trim().length !== 0) {
                    cleanTree = false;
                    dirtyBranch = "Dirty";
                }

                exec("git log "+tag+"..HEAD", function(error, stdout, stderr) {
                    if(stdout.trim().length !== 0) cleanTree = false;

                    exec("git rev-parse --short HEAD", function(error, stdout, stderr) {
                        gitHash = stdout.trim();

                        exec("git rev-parse --abbrev-ref HEAD", function(error, stdout, stderr) {
                            currentBranch = stdout.trim();
                    
                            var buildInfo = tag.split("--");
                            var varsion = buildInfo.length > 1 ? buildInfo[0] : data.tiapp.version;
                            var buildType = buildInfo.length > 1 ? buildInfo[1] : buildInfo[0];
                            //var v = version.match(/^[0-9]{1,2}([.][0-9]{1,2,3})([.][0-9]{1,2,3})?$/);
                            //console.log(v);
                            var buildString = varsion + " " + buildType;

                            if(!cleanTree || tag.length === 0 || buildType !== "GA") {

                                if(currentBranch !== 'master') {
                                    gitHash = "(" + currentBranch + ") " + gitHash;
                                }

                                buildString = buildString + " - " + gitHash + " " + dirtyBranch;

                            } 

                            data.tiapp.properties['build'] = { type: 'string', value: buildString };

                            finished(null, data);
                        });
                    });
                });

            });
        });


    });
};
