# Encoding: UTF-8
Gem::Specification.new do |s|
  s.platform          = Gem::Platform::RUBY
  s.name              = %q{refinery-epiceditor}
  s.version           = '0.0.1'
  s.description       = %q{Desc}
  s.summary           = %q{Summ}
  s.email             = %q{info@refinerycms.com}
  s.homepage          = %q{http://refinerycms.com}
  s.authors           = ['Marek Labos']
  s.license           = %q{MIT}
  s.require_paths     = %w(lib)

  s.files             = `git ls-files -- lib/*`.split("\n")
  s.require_paths     = %w(lib)

end
