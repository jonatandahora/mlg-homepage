require 'rubygems'
require 'httparty'

class MlgStream
  include HTTParty
  base_uri 'streamapi.majorleaguegaming.com'

  def get_all_streams
    get('/service/streams/all')
  end

  def get_stream_status(stream_name)
    get("/service/streams/status/#{stream_name}")
  end

  def get_streams_available
    get('/service/streams/all?status=1')
  end

  def get_stream_playback(stream_name,format='all',device='all')
    get("/service/streams/playback/#{stream_name}?format=#{format}&device=#{device}")
  end

end