rails_env = ENV['RAILS_ENV'] || 'development'

# real (non-HT) cores. returns 0 (zero) on some VMs:
cpu_cores =
    `grep -P "^physical id\t:|^cpu cores\t:" < /proc/cpuinfo | awk '{a[NR % 2] = $4} NR % 2 == 0 {print a[0] " " a[1]}' | sort -u | awk '{print $1}'` \
    .split("\n") \
    .collect { |cores| cores.to_i } \
    .reduce(0) {|sum, cores| sum += cores}
# cores (possibly including HT cores). works on VMs too:
cpu_cores = `grep "processor\t: " < /proc/cpuinfo | wc -l`.to_i if cpu_cores == 0
# fallback, should not happen
cpu_cores = 1 if cpu_cores == 0

puts "detected cpu cores: #{cpu_cores}"

# 2.5 workers per core
worker_processes Integer(60 / 24.0 * cpu_cores)

# Load rails+github.git into the master before forking workers
# for super-fast worker spawn times
preload_app true

# Restart any workers that haven't responded in 120 seconds
timeout 120

# Listen on a Unix data socket
# default as per http://unicorn.bogomips.org/Unicorn/Configurator.html
unix_socket_backlog = 1024
case rails_env
  when 'production'
    unix_socket = "/var/rails/homepage/tmp/sockets/production.sock"
    unix_socket_backlog = 2048
  when 'staging'
    unix_socket = "/var/www/homepage/tmp/sockets/staging.sock"
  else
    unix_socket = "#{`pwd`.strip}/tmp/sockets/#{rails_env}.sock"
end

require 'fileutils'
FileUtils.mkdir_p(File.dirname(unix_socket))
listen unix_socket, :backlog => unix_socket_backlog

before_fork do |server, worker|
  # When sent a USR2, Unicorn will suffix its pidfile with .oldbin and
  # immediately start loading up a new version of itself (loaded with a new
  # version of our app). When this new Unicorn is completely loaded
  # it will begin spawning workers. The first worker spawned will check to
  # see if an .oldbin pidfile exists. If so, this means we've just booted up
  # a new Unicorn and need to tell the old one that it can now die. To do so
  # we send it a QUIT.
  #
  # Using this method we get 0 downtime deploys.
  old_pid = "#{Rails.root}/tmp/pids/unicorn.pid.oldbin"

  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      # someone else did our job for us
    end
  end

  defined?(ActiveRecord::Base) and ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  # Unicorn master loads the app then forks off workers - because of the way
  # Unix forking works, we need to make sure we aren't using any of the parent's
  # sockets, e.g. db connection
  defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection

  # Redis and Memcached would go here but their connections are established
  # on demand, so the master never opens a socket
  # $redis = Redis.connect
end
