require 'rubygems'
require 'httparty'

class MlgStream
  include HTTParty
  format :json
  base_uri 'streamapi.majorleaguegaming.com'

  def self.get_all_streams
    response = get('/service/streams/all')
    if response['status_code'] == 200
      return response['data']['items']
    end
  end

  def self.get_stream_status(stream_name)
    response = get("/service/streams/status/#{stream_name}")
    if(response =='Cannot GET /service/streams/status/ ')
      return response = [07]
    end
    if response['status_code'] == 200
      return response['data']
    else
      return response = []
    end
  end

  def self.get_streams_available
    response = get('/service/streams/all?status=1')
    if response['status_code'] == 200
      return response['data']['items']
    end
  end

  def self.get_stream_playback(stream_name,format='all',device='all')
    response = get("/service/streams/playback/#{stream_name}?format=#{format}&device=#{device}")
    if response['status_code'] == 200
      return response['data']['items']
    end
  end

end