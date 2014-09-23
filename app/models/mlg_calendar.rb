require 'rubygems'
require 'httparty'

class MlgCalendar
  include HTTParty
  @uri = 'http://www.majorleaguegaming.com/'

  def self.get_scheduled_events
    get("#{@uri}/api/schedules")
  end

  def self.get_scheduled_events_by_date(start_date,end_date)
    get("#{@uri}/api/schedules?start=#{start_date}&end=#{end_date}")
  end

  def self.get_scheduled_events_by_channel(channel_ids)
    get("#{@uri}/api/schedules?channel_ids=#{channel_ids}")
  end

  def self.get_scheduled_events_by_channel_tag(channel_tags)
    get("#{@uri}/api/schedules?channel_tags=#{channel_tags}")
  end

end