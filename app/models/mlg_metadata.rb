require 'rubygems'
require 'httparty'


class MlgMetadata
  include HTTParty
  format :json
  headers 'Accept' => 'application/json'
  base_uri 'majorleaguegaming.com/'

  def self.get_all_channels
    response = get('/api/channels/all')
    if response['status_code'] == 200
      return response['data']['items']
    end
  end

  def self.get_channels_by_id(id)
    response = get("/api/channels/all?ids=#{id}")
    if response['status_code'] == 200
      return response['data']['items']
    end
  end

  def self.get_channels_by_type(type)
    response = get("/api/channels/all?type=#{type}")
    if response['status_code'] == 200
      return response['data']['items']
    end
  end

  def self.get_channels_by_tag(tags)
    response = get("/api/channels/all?tags=#{tags}")
    if response['status_code'] == 200
      return response['data']['items']
    end
  end

  def self.get_specific_channel(id)
    response = get("/api/channel/#{id}")
    if response['status_code'] == 200
      return response['data']
    end
  end

  def self.get_channels_by_specific_fields(fields)
    response = get("/api/channels/all?fields=#{fields}")
    if response['status_code'] == 200
      return response['data']['items']
    end
  end

end