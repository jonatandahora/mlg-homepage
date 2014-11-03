
class ChannelsController < ApplicationController
  layout 'channels'

  def index
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

def made
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

