require "spec_helper"

describe Scratch::GUI do
  it { expect(File.exist? Scratch::GUI.assets_path_for('htmls/gs-board.html')).to be true }
  it { expect(File.exist? Scratch::GUI.assets_path_for('htmls/vendor/polymer.html')).to be true }
  it { expect(File.exist? Scratch::GUI.assets_path_for('javascripts/vendor/webcomponents.min.js')).to be true }
end
