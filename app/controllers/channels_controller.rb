
class ChannelsController < ApplicationController
  layout 'channels'

def index
  get_channels
end

def made
  @canal = MlgMetadata.get_channels_by_id(325)
  get_channels
end

def channel
  id = params[:id]
  @canal = MlgMetadata.get_specific_channel(id)
  get_channels
end

def get_channels
  @channels = MlgMetadata.get_channels_by_tag('MLG%20Brasil')
  @channels.each { |channel|
    stream_name = channel['stream_name']
    next if stream_name.nil?
    status = MlgStream.get_stream_status(stream_name)
    case status['status']
      when -1
        channel['status'] = 'offline'
      when 2
        channel['status'] = 'replay'
      when 1
        channel['status'] = 'live'
    end
  }
end

end