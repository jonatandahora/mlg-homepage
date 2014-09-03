require 'rubygems'
require 'httparty'


class MlgMetadata
  @uri = 'http://www.majorleaguegaming.com/'

  def self.get_all_channels
    get("#{@uri}/api/channels/all")
  end

  def self.get_channels_by_id(id)
    get("#{@uri}/api/channels/all?ids=#{id}")
  end

  def self.get_channels_by_type(type)
    get("#{@uri}/api/channels/all?type=#{type}")
  end

  def self.get_channels_by_tag(tags)
    get("#{@uri}/api/channels/all?tags=#{tags}")
  end

  def self.get_channel_by_name(name)
    get("#{@uri}/api/channel/#{name}")
  end

  def self.get_channels_by_specific_fields(fields)
    get("#{@uri}/api/channels/all?fields=#{fields}")
  end

end