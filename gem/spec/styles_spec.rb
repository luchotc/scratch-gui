require "spec_helper"

describe Scratch::GUI do
  it { expect(File.exist? Scratch::GUI.assets_path_for('javascripts/lib.min.js')).to be true }
  it { expect(File.exist? Scratch::GUI.assets_path_for('javascripts/gui.js')).to be true }
end
