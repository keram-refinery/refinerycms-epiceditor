# Encoding: UTF-8
Gem::Specification.new do |s|
  s.platform          = Gem::Platform::RUBY
  s.name              = %q{refinerycms-epiceditor}
  s.version           = '0.0.1'
  s.description       = %q{Support for markdown http://epiceditor.com/ in refinerycms}
  s.summary           = %q{Support for markdown http://epiceditor.com/ in refinerycms}
  s.email             = %q{nospam.keram@gmail.com}
  s.homepage          = %q{http://refinery.sk}
  s.authors           = ['Marek Labos']
  s.license           = 'MIT'
  s.require_paths     = %w(lib)

  s.files             = `git ls-files -- lib/*`.split("\n")
  s.require_paths     = %w(lib)

  s.add_dependency 'redcarpet',        '~> 3.0.0'
  s.add_dependency 'refinerycms-core', '~> 2.718.0.dev'

end
