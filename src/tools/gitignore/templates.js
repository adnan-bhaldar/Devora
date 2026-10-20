/*
 * The templates behind the .gitignore generator.
 *
 * Most come from the open-source github/gitignore project (https://github.com/github/gitignore,
 * released under CC0 1.0, so they are free to use). They are trimmed for this tool: comment lines and
 * blank lines are removed, because the generator adds its own section titles.
 * The templates marked "Written for Devora" are short lists of the usual rules for those tools.
 *
 * Each template is { id, name, group, rules }. "rules" is the text of the template, one rule per line.
 */

export const GROUPS = [
    { id: 'language', name: 'Languages and build tools' },
    { id: 'framework', name: 'Frameworks and platforms' },
    { id: 'editor', name: 'Editors and IDEs' },
    { id: 'os', name: 'Operating systems' },
    { id: 'tool', name: 'Other tools' },
]

export const TEMPLATES = [
    {
        id: 'node',
        name: 'Node.js',
        group: 'language',
        rules: `logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
pids
*.pid
*.seed
*.pid.lock
lib-cov
coverage
*.lcov
.nyc_output
.grunt
bower_components
.lock-wscript
build/Release
node_modules/
jspm_packages/
web_modules/
*.tsbuildinfo
.npm
.eslintcache
.stylelintcache
.node_repl_history
*.tgz
.yarn-integrity
.env
.env.*
!.env.example
.cache
.parcel-cache
.next
out
.nuxt
dist
.output
.cache/
.vuepress/dist
.temp
.svelte-kit/
**/.vitepress/dist
**/.vitepress/cache
.docusaurus
.serverless/
.fusebox/
.dynamodb/
.firebase/
.tern-port
.vscode-test
.pnpm-store
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
.vite/
.astro/
.turbo`,
    },
    {
        id: 'python',
        name: 'Python',
        group: 'language',
        rules: `__pycache__/
*.py[codz]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST
*.manifest
*.spec
pip-log.txt
pip-delete-this-directory.txt
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py.cover
*.lcov
.hypothesis/
.pytest_cache/
cover/
*.mo
*.pot
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
instance/
.webassets-cache
.scrapy
docs/_build/
.pybuilder/
target/
.ipynb_checkpoints
profile_default/
ipython_config.py
.pdm-python
.pdm-build/
.pixi/*
!.pixi/config.toml
__pypackages__/
celerybeat-schedule*
celerybeat.pid
*.rdb
*.aof
*.pid
mnesia/
rabbitmq/
rabbitmq-data/
activemq-data/
*.sage.py
.env
.envrc
.venv
env/
venv/
ENV/
env.bak/
venv.bak/
.spyderproject
.spyproject
.ropeproject
/site
.mypy_cache/
.dmypy.json
dmypy.json
.pyre/
.pytype/
cython_debug/
.abstra/
tempCodeRunnerFile.py
.ruff_cache/
.pypirc
marimo/_static/
marimo/_lsp/
__marimo__/
.streamlit/secrets.toml`,
    },
    {
        id: 'java',
        name: 'Java',
        group: 'language',
        rules: `*.class
*.log
*.ctxt
.mtj.tmp/
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
hs_err_pid*
replay_pid*`,
    },
    {
        id: 'kotlin',
        name: 'Kotlin',
        group: 'language',
        rules: `*.class
*.log
*.ctxt
.mtj.tmp/
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
hs_err_pid*
replay_pid*
.kotlin/`,
    },
    {
        id: 'go',
        name: 'Go',
        group: 'language',
        rules: `*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
coverage.*
!coverage.go
*.coverprofile
profile.cov
go.work
go.work.sum
.env`,
    },
    {
        id: 'rust',
        name: 'Rust',
        group: 'language',
        rules: `debug
target
**/*.rs.bk
*.pdb
**/mutants.out*/
rustc-ice-*.txt`,
    },
    {
        id: 'ruby',
        name: 'Ruby',
        group: 'language',
        rules: `*.gem
*.rbc
/.config
/coverage/
/InstalledFiles
/pkg/
/spec/reports/
/spec/examples.txt
/test/tmp/
/test/version_tmp/
/tmp/
.byebug_history
.dat*
.repl_history
build/
*.bridgesupport
build-iPhoneOS/
build-iPhoneSimulator/
/.yardoc/
/_yardoc/
/doc/
/rdoc/
/.bundle/
/vendor/bundle
/lib/bundler/man/
.rvmrc`,
    },
    {
        id: 'php',
        name: 'PHP (Composer)',
        group: 'language',
        rules: `composer.phar
/vendor/`,
    },
    {
        id: 'c',
        name: 'C',
        group: 'language',
        rules: `*.d
*.o
*.ko
*.obj
*.elf
*.ilk
*.map
*.exp
*.gch
*.pch
*.lib
*.a
*.la
*.lo
*.dll
*.so
*.so.*
*.dylib
*.exe
*.out
*.app
*.i*86
*.x86_64
*.hex
*.dSYM/
*.su
*.idb
*.pdb
*.mod*
*.cmd
.tmp_versions/
modules.order
Module.symvers
Mkfile.old
dkms.conf
*.dwo`,
    },
    {
        id: 'cpp',
        name: 'C++',
        group: 'language',
        rules: `*.d
*.slo
*.lo
*.o
*.obj
*.gch
*.pch
*.ilk
*.pdb
*.so
*.dylib
*.dll
*.so.*
*.mod
*.smod
*.lai
*.la
*.a
*.lib
*.exe
*.out
*.app
build/
Build/
build-*/
CMakeFiles/
CMakeCache.txt
cmake_install.cmake
Makefile
install_manifest.txt
compile_commands.json
*.tmp
*.log
*.bak
*.swp
vcpkg_installed/
*.dwo
Testing/
.cache/`,
    },
    {
        id: 'dotnet',
        name: '.NET',
        group: 'language',
        rules: `[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/
project.lock.json
project.fragment.lock.json
artifacts/
ScaffoldingReadMe.txt
*.nupkg
*.snupkg
.env
~$*
*~
CodeCoverage/
*.binlog
[Tt]est[Rr]esult*/
[Bb]uild[Ll]og.*
*.VisualState.xml
TestResult.xml
nunit-*.xml`,
    },
    {
        id: 'visualstudio',
        name: 'Visual Studio',
        group: 'language',
        rules: `*.rsuser
*.suo
*.user
*.userosscache
*.sln.docstates
*.env
*.userprefs
mono_crash.*
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
[Dd]ebug/x64/
[Dd]ebugPublic/x64/
[Rr]elease/x64/
[Rr]eleases/x64/
bin/x64/
obj/x64/
[Dd]ebug/x86/
[Dd]ebugPublic/x86/
[Rr]elease/x86/
[Rr]eleases/x86/
bin/x86/
obj/x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
[Aa][Rr][Mm]64[Ee][Cc]/
bld/
[Oo]bj/
[Oo]ut/
[Ll]og/
[Ll]ogs/
**/[Bb]in/*
.vs/
Generated\\ Files/
[Tt]est[Rr]esult*/
[Bb]uild[Ll]og.*
*.trx
*.VisualState.xml
TestResult.xml
nunit-*.xml
*.received.*
[Dd]ebugPS/
[Rr]eleasePS/
dlldata.c
BenchmarkDotNet.Artifacts/
project.lock.json
project.fragment.lock.json
artifacts/
.artifacts/
ScaffoldingReadMe.txt
StyleCopReport.xml
*_i.c
*_p.c
*_h.h
*.ilk
*.meta
*.obj
*.idb
*.iobj
*.pch
*.pdb
*.ipdb
*.pgc
*.pgd
*.rsp
!Directory.Build.rsp
*.sbr
*.tlb
*.tli
*.tlh
*.tmp
*.tmp_proj
*_wpftmp.csproj
*.log
*.tlog
*.vspscc
*.vssscc
.builds
*.pidb
*.svclog
*.scc
_Chutzpah*
ipch/
*.aps
*.ncb
*.opendb
*.opensdf
*.sdf
*.cachefile
*.VC.db
*.VC.VC.opendb
*.psess
*.vsp
*.vspx
*.sap
*.e2e
$tf/
*.gpState
_ReSharper*/
*.[Rr]e[Ss]harper
*.DotSettings.user
_TeamCity*
*.dotCover
.axoCover/*
!.axoCover/settings.json
coverage*.json
coverage*.xml
coverage*.info
*.coverage
*.coveragexml
_NCrunch_*
.NCrunch_*
.*crunch*.local.xml
nCrunchTemp_*
*.mm.*
AutoTest.Net/
.sass-cache/
[Ee]xpress/
DocProject/buildhelp/
DocProject/Help/*.HxT
DocProject/Help/*.HxC
DocProject/Help/*.hhc
DocProject/Help/*.hhk
DocProject/Help/*.hhp
DocProject/Help/Html2
DocProject/Help/html
publish/
*.[Pp]ublish.xml
*.azurePubxml
*.pubxml
*.publishproj
PublishScripts/
*.nupkg
*.snupkg
**/[Pp]ackages/*
!**/[Pp]ackages/build/
*.nuget.props
*.nuget.targets
csx/
*.build.csdef
ecf/
rcf/
AppPackages/
BundleArtifacts/
Package.StoreAssociation.xml
_pkginfo.txt
*.appx
*.appxbundle
*.appxupload
*.[Cc]ache
!?*.[Cc]ache/
ClientBin/
~$*
*~
*.dbmdl
*.dbproj.schemaview
*.jfm
*.pfx
*.publishsettings
orleans.codegen.cs
Generated_Code/
_UpgradeReport_Files/
Backup*/
UpgradeLog*.XML
UpgradeLog*.htm
ServiceFabricBackup/
*.rptproj.bak
*.mdf
*.ldf
*.ndf
*.rdl.data
*.bim.layout
*.bim_*.settings
*.rptproj.rsuser
*- [Bb]ackup.rdl
*- [Bb]ackup ([0-9]).rdl
*- [Bb]ackup ([0-9][0-9]).rdl
FakesAssemblies/
*.GhostDoc.xml
.ntvs_analysis.dat
node_modules/
*.plg
*.opt
*.vbw
*.dsw
*.dsp
*.ncb
*.aps
**/*.HTMLClient/GeneratedArtifacts
**/*.DesktopClient/GeneratedArtifacts
**/*.DesktopClient/ModelManifest.xml
**/*.Server/GeneratedArtifacts
**/*.Server/ModelManifest.xml
_Pvt_Extensions
**/.paket/paket.exe
paket-files/
**/.fake/
**/.cr/personal
**/__pycache__/
*.pyc
*.tss
*.jmconfig
*.btp.cs
*.btm.cs
*.odx.cs
*.xsd.cs
OpenCover/
ASALocalRun/
*.binlog
MSBuild_Logs/
.aws-sam
*.nvuser
**/.mfractor/
**/.localhistory/
.vshistory/
healthchecksdb
MigrationBackup/
**/.ionide/
FodyWeavers.xsd
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets
.history/
*.vsix
*.cab
*.msi
*.msix
*.msm
*.msp`,
    },
    {
        id: 'swift',
        name: 'Swift',
        group: 'language',
        rules: `xcuserdata/
*.hmap
*.ipa
*.dSYM.zip
*.dSYM
timeline.xctimeline
playground.xcworkspace
.build/
Carthage/Build/
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/**/*.png
fastlane/test_output`,
    },
    {
        id: 'objective-c',
        name: 'Objective-C',
        group: 'language',
        rules: `xcuserdata/
*.hmap
*.ipa
*.dSYM.zip
*.dSYM
Carthage/Build/
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/**/*.png
fastlane/test_output`,
    },
    {
        id: 'dart',
        name: 'Dart',
        group: 'language',
        rules: `.dart_tool/
.packages
build/
pubspec.lock
doc/api/
.env*
*.dart.js
*.info.json
*.js
*.js_
*.js.deps
*.js.map
.flutter-plugins
.flutter-plugins-dependencies`,
    },
    {
        id: 'elixir',
        name: 'Elixir',
        group: 'language',
        rules: `/_build
/cover
/deps
/doc
/.fetch
erl_crash.dump
*.ez
*.beam
/config/*.secret.exs
.elixir_ls/`,
    },
    {
        id: 'haskell',
        name: 'Haskell',
        group: 'language',
        rules: `dist
dist-*
cabal-dev
*.o
*.hi
*.hie
*.chi
*.chs.h
*.dyn_o
*.dyn_hi
.hpc
.hsenv
.cabal-sandbox/
cabal.sandbox.config
*.prof
*.aux
*.hp
*.eventlog
.stack-work/
cabal.project.local
cabal.project.local~
.HTF/
.ghc.environment.*`,
    },
    {
        id: 'scala',
        name: 'Scala',
        group: 'language',
        rules: `*.class
*.tasty
*.log
hs_err_pid*`,
    },
    {
        id: 'r',
        name: 'R',
        group: 'language',
        rules: `.Rhistory
.Rapp.history
.RData
.RDataTmp
.Ruserdata
*-Ex.R
/*.tar.gz
/*.Rcheck/
.Rproj.user/
vignettes/*.html
vignettes/*.pdf
.httr-oauth
*_cache/
/cache/
*.utf8.md
*.knit.md
.Renviron
.env
docs/
po/*~
rsconnect/`,
    },
    {
        id: 'julia',
        name: 'Julia',
        group: 'language',
        rules: `*.jl.cov
*.jl.*.cov
*.jl.mem
*.jl.*.mem
deps/deps.jl
deps/build.log
deps/downloads/
deps/usr/
deps/src/
docs/build/
docs/site/
Manifest*.toml
LocalPreferences.toml
JuliaLocalPreferences.toml
.CondaPkg/`,
    },
    {
        id: 'lua',
        name: 'Lua',
        group: 'language',
        rules: `luac.out
*.src.rock
*.zip
*.tar.gz
*.o
*.os
*.ko
*.obj
*.elf
*.gch
*.pch
*.lib
*.a
*.la
*.lo
*.def
*.exp
*.dll
*.so
*.so.*
*.dylib
*.exe
*.out
*.app
*.i*86
*.x86_64
*.hex`,
    },
    {
        id: 'perl',
        name: 'Perl',
        group: 'language',
        rules: `!Build/
.last_cover_stats
/META.yml
/META.json
/MYMETA.*
*.o
*.pm.tdy
*.bs
cover_db/
nytprof.out
/.build/
_build/
Build
Build.bat
inc/
/blib/
/_eumm/
/*.gz
/Makefile
/Makefile.old
/MANIFEST.bak
/pm_to_blib
/*.zip
/local/
/.carmel/`,
    },
    {
        id: 'latex',
        name: 'LaTeX',
        group: 'language',
        rules: `*.aux
*.lof
*.log
*.lot
*.fls
*.out
*.toc
*.fmt
*.fot
*.cb
*.cb2
.*.lb
*.dvi
*.xdv
*-converted-to.*
.pdf
*.bbl
*.bbl-SAVE-ERROR
*.bcf
*.bcf-SAVE-ERROR
*.blg
*-blx.aux
*-blx.bib
*.run.xml
*.fdb_latexmk
*.synctex
*.synctex(busy)
*.synctex.gz
*.synctex.gz(busy)
*.pdfsync
*.rubbercache
rubber.cache
latex.out/
*.alg
*.loa
acs-*.bib
*.thm
*.atfi
*.nav
*.pre
*.snm
*.vrb
*.soc
*.loc
*.cut
*.tuc
*.tui
*.tuo
*.cpt
*.spl
*.ent
*.lox
*.mf
*.mp
*.t[1-9]
*.t[1-9][0-9]
*.tfm
*.end
*.?end
*.[1-9]
*.[1-9][0-9]
*.[1-9][0-9][0-9]
*.[1-9]R
*.[1-9][0-9]R
*.[1-9][0-9][0-9]R
*.eledsec[1-9]
*.eledsec[1-9]R
*.eledsec[1-9][0-9]
*.eledsec[1-9][0-9]R
*.eledsec[1-9][0-9][0-9]
*.eledsec[1-9][0-9][0-9]R
*.acn
*.acr
*.glg
*.glg-abr
*.glo
*.glo-abr
*.gls
*.gls-abr
*.glsdefs
*.lzo
*.lzs
*.slg
*.slo
*.sls
*.gnuplot
*.table
*-gnuplottex-*
*.gaux
*.glog
*.gtex
*.4ct
*.4tc
*.idv
*.lg
*.trc
*.xref
*.hd
*.brf
*-concordance.tex
*-tikzDictionary
*.lol
*.ltjruby
*.idx
*.ilg
*.ind
*.maf
*.mlf
*.mlt
*.mtc[0-9]*
*.slf[0-9]*
*.slt[0-9]*
*.stc[0-9]*
_minted*
*.data.minted
*.pyg
*.mw
*.newpax
*.nlg
*.nlo
*.nls
*.pax
*.pdfpc
*.sagetex.sage
*.sagetex.py
*.sagetex.scmd
*.wrt
*.spell.bad
*.spell.txt
svg-inkscape/
*.sout
*.sympy
sympy-plots-for-*.tex/
*.upa
*.upb
*.pytxcode
pythontex-files-*/
*.listing
*.loe
*.dpth
*.md5
*.auxlock
*.ptc
*.tdo
*.hst
*.ver
*.lod
*.xcp
*.xmpi
*.xdy
*.xyc
*.xyd
*.ttt
*.fff
TSWLatexianTemp*
*.bak
*.sav
*.bak[0-9]*
.texpadtmp
*.lyx~
*.backup
.*.swp
*~[0-9]*
*.tps
./auto/*
*.el
*-tags.tex
*.sta
*.lpz
*.xwm`,
    },
    {
        id: 'zig',
        name: 'Zig',
        group: 'language',
        rules: `.zig-cache/
zig-out/
zig-pkg/
*.o`,
    },
    {
        id: 'deno',
        name: 'Deno',
        group: 'language',
        rules: `.deno/
coverage/
*.lcov`,
    },
    {
        id: 'bun',
        name: 'Bun',
        group: 'language',
        rules: `logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
*.sqlite
package-json.lock
node_modules.bun
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
pids
*.pid
*.seed
*.pid.lock
lib-cov
coverage
*.lcov
.nyc_output
.grunt
bower_components
.lock-wscript
build/Release
node_modules/
jspm_packages/
typings/
*.tsbuildinfo
.npm
.eslintcache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/
.node_repl_history
*.tgz
.yarn-integrity
.env
.env.test
.cache
.next
.nuxt
dist
.cache/
.vuepress/dist
.serverless/
.fusebox/
.dynamodb/
.tern-port`,
    },
    {
        id: 'gradle',
        name: 'Gradle',
        group: 'language',
        rules: `.gradle
**/build/
!**/src/**/build/
gradle-app.setting
!gradle-wrapper.jar
!gradle-wrapper.properties
.gradletasknamecache
.project
.classpath`,
    },
    {
        id: 'maven',
        name: 'Maven',
        group: 'language',
        rules: `target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar
.project
.classpath`,
    },
    {
        id: 'terraform',
        name: 'Terraform',
        group: 'language',
        rules: `.terraform/
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfvars.json
override.tf
override.tf.json
*_override.tf
*_override.tf.json
.terraform.tfstate.lock.info
.terraformrc
terraform.rc`,
    },
    {
        id: 'react',
        name: 'React',
        group: 'framework',
        // Written for Devora.
        rules: `node_modules
.pnp
.pnp.js
coverage
build
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*`,
    },
    {
        id: 'vue',
        name: 'Vue',
        group: 'framework',
        // Written for Devora.
        rules: `node_modules
dist
dist-ssr
coverage
*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
*.tsbuildinfo`,
    },
    {
        id: 'svelte',
        name: 'Svelte',
        group: 'framework',
        // Written for Devora.
        rules: `node_modules
dist
dist-ssr
*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
*.tsbuildinfo`,
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        group: 'framework',
        rules: `/node_modules
/.pnp
.pnp.js
/coverage
/.next/
/out/
/build
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env*.local
.env
.vercel
*.tsbuildinfo
next-env.d.ts`,
    },
    {
        id: 'nestjs',
        name: 'NestJS',
        group: 'framework',
        rules: `/dist
/node_modules
/build
/tmp
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.env
.env.development
.env.test
.env.production
.temp
.tmp`,
    },
    {
        id: 'angular',
        name: 'Angular',
        group: 'framework',
        rules: `/dist/
/out-tsc/
/tmp/
/coverage/
/e2e/test-output/
/.angular/
.angular/
/node_modules/
/package-lock.json
/yarn.lock
/.env
/.angular-cli.json
/.ng/
*.tsbuildinfo
npm-debug.log*
yarn-debug.log*
yarn-error.log*`,
    },
    {
        id: 'vite',
        name: 'Vite',
        group: 'framework',
        // Written for Devora.
        rules: `node_modules
dist
dist-ssr
*.local
*.tsbuildinfo`,
    },
    {
        id: 'nuxt',
        name: 'Nuxt',
        group: 'framework',
        // Written for Devora.
        rules: `.nuxt
.output
.data
.nitro
.cache
dist`,
    },
    {
        id: 'sveltekit',
        name: 'SvelteKit',
        group: 'framework',
        // Written for Devora.
        rules: `.svelte-kit
build
.vercel
.netlify
vite.config.js.timestamp-*
vite.config.ts.timestamp-*`,
    },
    {
        id: 'django',
        name: 'Django',
        group: 'framework',
        // Written for Devora.
        rules: `*.log
*.pot
*.pyc
__pycache__/
local_settings.py
db.sqlite3
db.sqlite3-journal
media/
staticfiles/`,
    },
    {
        id: 'rails',
        name: 'Ruby on Rails',
        group: 'framework',
        rules: `*.rbc
capybara-*.html
.rspec
/db/*.sqlite3
/db/*.sqlite3-journal
/db/*.sqlite3-[0-9]*
/public/system
/coverage/
/spec/tmp
*.orig
rerun.txt
pickle-email-*.html
/log/*
/tmp/*
!/log/.keep
!/tmp/.keep
config/initializers/secret_token.rb
config/master.key
.env
.env*.local
/.bundle
/vendor/bundle
.rvmrc
/vendor/assets/bower_components
*.bowerrc
bower.json
.powenv
.byebug_history
node_modules/
/public/packs
/public/packs-test
/public/assets
/yarn-error.log
yarn-debug.log*
.yarn-integrity
/storage/*
!/storage/.keep
/public/uploads`,
    },
    {
        id: 'laravel',
        name: 'Laravel',
        group: 'framework',
        rules: `/vendor/
node_modules/
npm-debug.log
yarn-error.log
bootstrap/compiled.php
app/storage/
public/storage
public/hot
public_html/storage
public_html/hot
storage/*.key
.env
Homestead.yaml
Homestead.json
/.vagrant
.phpunit.result.cache
/.phpunit.cache
/public/build
/storage/pail
.env.backup
.env.production
.phpactor.json
auth.json`,
    },
    {
        id: 'symfony',
        name: 'Symfony',
        group: 'framework',
        rules: `/app/cache/*
/app/logs/*
!app/cache/.gitkeep
!app/logs/.gitkeep
/app/spool/*
/var/cache/*
/var/logs/*
/var/sessions/*
!var/cache/.gitkeep
!var/logs/.gitkeep
!var/sessions/.gitkeep
/var/log/*
!var/log/.gitkeep
/app/config/parameters.yml
/app/config/parameters.ini
/app/bootstrap.php.cache
/var/bootstrap.php.cache
/bin/*
!bin/console
!bin/symfony_requirements
/vendor/
/web/bundles/
/web/uploads/
/app/phpunit.xml
/phpunit.xml
/build/
/composer.phar
**/Entity/*~
/.web-server-pid`,
    },
    {
        id: 'wordpress',
        name: 'WordPress',
        group: 'framework',
        rules: `/wp-admin/
/wp-content/index.php
/wp-content/languages
/wp-content/plugins/index.php
/wp-content/themes/index.php
/wp-includes/
/index.php
/license.txt
/readme.html
/wp-*.php
/xmlrpc.php
wp-config.php
/wp-content/themes/twenty*/
/wp-content/plugins/hello.php
/wp-content/uploads/
*.log
/.htaccess`,
    },
    {
        id: 'jekyll',
        name: 'Jekyll',
        group: 'framework',
        rules: `_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata
.bundle/
vendor/`,
    },
    {
        id: 'flutter',
        name: 'Flutter',
        group: 'framework',
        // Written for Devora.
        rules: `*.class
*.log
*.pyc
*.swp
.DS_Store
.atom/
.build/
.buildlog/
.history
.svn/
.swiftpm/
migrate_working_dir/
*.iml
*.ipr
*.iws
.idea/
**/doc/api/
.dart_tool/
.flutter-plugins-dependencies
.pub-cache/
.pub/
/build/
app.*.symbols
app.*.map.json
/android/app/debug
/android/app/profile
/android/app/release`,
    },
    {
        id: 'android',
        name: 'Android',
        group: 'framework',
        rules: `.gradle/
build/
.kotlin/
local.properties
*.log
captures/
.externalNativeBuild/
.cxx/
*.aab
*.apk
output-metadata.json
*.iml
.idea/
misc.xml
deploymentTargetDropDown.xml
render.experimental.xml
*.jks
*.keystore
google-services.json
*.hprof`,
    },
    {
        id: 'unity',
        name: 'Unity',
        group: 'framework',
        rules: `.utmp/
/[Ll]ibrary/
/[Tt]emp/
/[Oo]bj/
/[Bb]uild/
/[Bb]uilds/
/[Ll]ogs/
/[Uu]ser[Ss]ettings/
*.log
*.blend1
*.blend1.meta
/[Mm]emoryCaptures/
/[Rr]ecordings/
/[Aa]ssets/Plugins/Editor/JetBrains*
*.DotSettings.user
.vs/
.gradle/
ExportedObj/
.consulo/
*.csproj
*.unityproj
*.sln
*.slnx
*.suo
*.tmp
*.user
*.userprefs
*.pidb
*.booproj
*.svd
*.pdb
*.mdb
*.opendb
*.VC.db
*.pidb.meta
*.pdb.meta
*.mdb.meta
sysinfo.txt
mono_crash.*
*.apk
*.aab
*.unitypackage
*.unitypackage.meta
*.app
crashlytics-build.properties
InitTestScene*.unity*
/ServerData
/[Aa]ssets/StreamingAssets/aa*
/[Aa]ssets/AddressableAssetsData/link.xml*
/[Aa]ssets/Addressables_Temp*
/[Aa]ssets/AddressableAssetsData/*/*.bin*
/[Aa]ssets/Unity.VisualScripting.Generated/VisualScripting.Flow/UnitOptions.db
/[Aa]ssets/Unity.VisualScripting.Generated/VisualScripting.Flow/UnitOptions.db.meta
/[Aa]ssets/Unity.VisualScripting.Generated/VisualScripting.Core/Property Providers
/[Aa]ssets/Unity.VisualScripting.Generated/VisualScripting.Core/Property Providers.meta
/[Aa]ssets/[Ii]nit[Tt]est[Ss]cene*.unity*
/UIElementsSchema/
/[Aa]ssets/[Ss]ceneDependencyCache*`,
    },
    {
        id: 'unreal',
        name: 'Unreal Engine',
        group: 'framework',
        rules: `.vs/
*.slo
*.lo
*.o
*.obj
*.gch
*.pch
*.so
*.dylib
*.dll
*.mod
*.lai
*.la
*.a
*.lib
*.exe
*.out
*.app
*.ipa
*.xcodeproj
*.xcworkspace
*.sln
*.suo
*.opensdf
*.sdf
*.VC.db
*.VC.opendb
.vsconfig
SourceArt/**/*.png
SourceArt/**/*.tga
Binaries/*
Plugins/**/Binaries/*
Build/*
!Build/*/
Build/*/**
!Build/*/PakBlacklist*.txt
!Build/**/*.ico
*_BuiltData.uasset
Saved/*
Intermediate/*
Plugins/**/Intermediate/*
DerivedDataCache/*`,
    },
    {
        id: 'godot',
        name: 'Godot',
        group: 'framework',
        rules: `~*.dll
.godot/
.nomedia
.import/
export.cfg
export_credentials.cfg
*.tmp
*.translation
.mono/
data_*/
mono_crash.*.json
*.exe`,
    },
    {
        id: 'vscode',
        name: 'Visual Studio Code',
        group: 'editor',
        rules: `.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets
!*.code-workspace
*.vsix`,
    },
    {
        id: 'jetbrains',
        name: 'JetBrains (IntelliJ, WebStorm, PyCharm)',
        group: 'editor',
        rules: `.idea/**/workspace.xml
.idea/**/tasks.xml
.idea/**/usage.statistics.xml
.idea/**/dictionaries
.idea/**/shelf
.idea/**/aws.xml
.idea/**/contentModel.xml
.idea/**/dataSources/
.idea/**/dataSources.ids
.idea/**/dataSources.local.xml
.idea/**/sqlDataSources.xml
.idea/**/dynamic.xml
.idea/**/uiDesigner.xml
.idea/**/dbnavigator.xml
.idea/**/gradle.xml
.idea/**/libraries
cmake-build-*/
.idea/**/mongoSettings.xml
*.iws
out/
.idea_modules/
atlassian-ide-plugin.xml
.idea/replstate.xml
.idea/sonarlint/
.idea/sonarlint.xml
com_crashlytics_export_strings.xml
crashlytics.properties
crashlytics-build.properties
fabric.properties
.idea/httpRequests
http-client.private.env.json
.idea/caches/build_file_checksums.ser
.idea/.cache/.Apifox_Helper
.idea/ApifoxUploaderProjectSetting.xml
.idea/**/copilot.data.migration.*.xml`,
    },
    {
        id: 'vim',
        name: 'Vim',
        group: 'editor',
        rules: `[._]*.s[a-v][a-z]
!*.svg
[._]*.sw[a-p]
[._]s[a-rt-v][a-z]
[._]ss[a-gi-z]
[._]sw[a-p]
Session.vim
Sessionx.vim
.netrwhist
*~
tags
[._]*.un~`,
    },
    {
        id: 'emacs',
        name: 'Emacs',
        group: 'editor',
        rules: `*~
\\#*\\#
/.emacs.desktop
/.emacs.desktop.lock
*.elc
auto-save-list
tramp
.\\#*
.org-id-locations
*_archive
*_flymake.*
/eshell/history
/eshell/lastdir
/elpa/
*.rel
/auto/
.cask/
dist/
flycheck_*.el
/server/
.projectile
.dir-locals.el
/network-security.data
*.~undo-tree~`,
    },
    {
        id: 'sublime',
        name: 'Sublime Text',
        group: 'editor',
        rules: `*.tmlanguage.cache
*.tmPreferences.cache
*.stTheme.cache
*.sublime-workspace
sftp-config.json
sftp-config-alt*.json
Package Control.last-run
Package Control.ca-list
Package Control.ca-bundle
Package Control.system-ca-bundle
Package Control.cache/
Package Control.ca-certs/
Package Control.merged-ca-bundle
Package Control.user-ca-bundle
oscrypto-ca-bundle.crt
bh_unicode_properties.cache
GitHub.sublime-settings`,
    },
    {
        id: 'eclipse',
        name: 'Eclipse',
        group: 'editor',
        rules: `.metadata
bin/
tmp/
*.tmp
*.bak
*.swp
*~.nib
local.properties
.settings/
.loadpath
.recommenders
.externalToolBuilders/
*.launch
*.pydevproject
.cproject
.autotools
.factorypath
.buildpath
.target
.tern-project
.texlipse
.springBeans
.recommenders/
.apt_generated/
.apt_generated_tests/
.cache-main
.scala_dependencies
.worksheet`,
    },
    {
        id: 'netbeans',
        name: 'NetBeans',
        group: 'editor',
        rules: `**/nbproject/private/
**/nbproject/Makefile-*.mk
**/nbproject/Package-*.bash
build/
nbbuild/
dist/
nbdist/
.nb-gradle/`,
    },
    {
        id: 'xcode',
        name: 'Xcode',
        group: 'editor',
        rules: `xcuserdata/`,
    },
    {
        id: 'cursor',
        name: 'Cursor',
        group: 'editor',
        rules: `.cursorignore
.cursorindexingignore`,
    },
    {
        id: 'zed',
        name: 'Zed',
        group: 'editor',
        rules: `.zed/*
!.zed/settings.json
!.zed/tasks.json
!.zed/debug.json`,
    },
    {
        id: 'macos',
        name: 'macOS',
        group: 'os',
        rules: `.DS_Store
.localized
__MACOSX/
.AppleDouble
.LSOverride
Icon[[:cntrl:]]
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.com.apple.timemachine.supported
.PKInstallSandboxManager
.PKInstallSandboxManager-SystemSoftware
.hotfiles.btree
.vol
.file
.disk_label*
lost+found
.HFS+ Private Directory Data[[:cntrl:]]
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk
Desktop DB
Desktop DF
TheFindByContentFolder
TheVolumeSettingsFolder
.FBCIndex
.FBCSemaphoreFile
.FBCLockFolder
.quota.group
.quota.user
.quota.ops.group
.quota.ops.user
Backups.backupdb
.MobileBackups
.MobileBackups.trash
MobileBackups.trash
tmbootpicker.efi`,
    },
    {
        id: 'windows',
        name: 'Windows',
        group: 'os',
        rules: `Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk`,
    },
    {
        id: 'linux',
        name: 'Linux',
        group: 'os',
        rules: `*~
.fuse_hidden*
.directory
.Trash-*
.nfs*
nohup.out`,
    },
    {
        id: 'dotenv',
        name: 'Environment files (.env)',
        group: 'tool',
        // Written for Devora.
        rules: `.env
.env.*
!.env.example`,
    },
    {
        id: 'virtualenv',
        name: 'Python virtual environments',
        group: 'tool',
        rules: `.venv/
venv/
.python-version
pyvenv.cfg
pip-selfcheck.json
.Python
[Bb]in
[Ii]nclude
[Ll]ib
[Ll]ib64
[Ll]ocal
[Ss]cripts`,
    },
    {
        id: 'ansible',
        name: 'Ansible',
        group: 'tool',
        rules: `.ansible/
*.retry`,
    },
    {
        id: 'vagrant',
        name: 'Vagrant',
        group: 'tool',
        rules: `.vagrant/`,
    },
    {
        id: 'archives',
        name: 'Archives (zip, tar, and so on)',
        group: 'tool',
        rules: `*.7z
*.jar
*.rar
*.zip
*.gz
*.gzip
*.tgz
*.bzip
*.bzip2
*.bz2
*.xz
*.lzma
*.cab
*.xar
*.zst
*.tzst
*.iso
*.tar
*.dmg
*.xpi
*.gem
*.egg
*.deb
*.rpm
*.msi
*.msm
*.msp
*.txz`,
    },
]