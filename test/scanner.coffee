# -- test tools

chai = require "chai"
expect = chai.expect;

# -- tested functions

dir = require "../src/scanner/dir"
recursiveDir = require "../src/scanner/recursiveDir"
controllers = require "../src/scanner/controllers"

# --

describe 'dir', () ->

	it 'should correctly return structured contents of a directory', () ->

		results = dir(__dirname + '/data/controllers')

		expect(results.dirs.length).to.equal(1)
		expect(results.controllers.length).to.equal(1)
		expect(results.plugins.length).to.equal(0)

describe 'recursiveDir', () ->

	it 'should correctly return structure contents of multiple descending directories', () ->

		results = recursiveDir(__dirname + '/data/controllers')
		expect(results.dirs.movies).to.be.an('object')

describe 'controllers', () ->

	it 'should correctly return an array of all controllers in a given directory structure', () ->

		results = recursiveDir(__dirname + '/data/controllers')
		ctrls = controllers(results)

		expect(ctrls.length).to.equal(5)