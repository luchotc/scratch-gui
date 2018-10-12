require "scratch/gui/version"

module Scratch
  module GUI
    class Engine < ::Rails::Engine
    end if defined? ::Rails::Engine

    ASSETS_PATH = File.join(__dir__, '..', '..', 'app', 'assets')
    PUBLIC_PATH = File.join(__dir__, '..', '..', 'public', 'static')

    def self.assets_path_for(asset)
      File.join ASSETS_PATH, asset
    end

    def self.public_path_for(asset)
      File.join PUBLIC_PATH, asset
    end
  end
end
