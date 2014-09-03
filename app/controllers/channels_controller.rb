class ChannelsController < ApplicationController
  def index
    @channels = MlgMetadata.get_all_channels
  end
end
