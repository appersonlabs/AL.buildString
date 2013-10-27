AL.buildString
==============

This plugin will make a Ti app property called build avaliable in your app. It can be accessed like this:

alert(Ti.App.Properties.getString('build','property not found'));

You then simply need to tag your releases in GIT with the following format as an example:

1.0.3--GA

The build script will look to make sure your local cloan is not ahead of the latest tag. If it is it will also include your GIT hash.
Further, if the build is based on un-commited changes the build string will include the text "Dirty" at the end of the build string.
If the build is based on a branch other then master, the string will contain the branch name as well.

A sample build string would be:

1.0.3 GA (feature-branch)h423u4hh Dirty

To install, from your titanium project root, run this:

git submodule add git://github.com/appersonlabs/AL.buildString.git plugins

Then add this to tiapp.xml:
    <plugins>
        <plugin version="1.0">AL.buildString</plugin>
    </plugins>
    
Note, that some projects like alloy based apps will already have a plugins xml node and you simply need to add the extra entry.

