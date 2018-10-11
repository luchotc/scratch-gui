lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "scratch/gui/version"

Gem::Specification.new do |spec|
  spec.authors       = ["Luis Cannavo"]
  spec.email         = ["luchotc@hotmail.com.ar"]

  spec.summary       = "Scratch GUI"
  spec.homepage      = "https://github.com/luchotc/scratch-gui"
  spec.license       = "MIT"

  spec.files         = Dir["lib/**/*"] + Dir["app/**/*"] + ["Rakefile", "README.md"]
  spec.test_files    = `git ls-files -- {test,spec}/*`.split("\n")

  spec.name          = "scratch-gui"
  spec.require_paths = ["lib"]
  spec.version       = Scratch::Gui::VERSION

  spec.add_development_dependency "bundler", "~> 1.16.a"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "rspec", "~> 3.0"

  spec.required_ruby_version = '~> 2.3'
end
