class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  #before_filter :check_url



  def check_url
    current = root_url(:only_path => false)
    home = 'http://home.mlgbrasil.tv/'
    if(current!= home)
    redirect_to home
    end
  end
end
