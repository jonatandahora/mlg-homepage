# coding: UTF-8

class ContactsController < ApplicationController
  layout 'without_video'
  def new
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(params[:contact])
    @contact.request = request
    if @contact.deliver
      flash.now[:notice] = 'Obrigado por sua mensagem, o contataremos em breve!'
    else
      flash.now[:error] = 'Mensagem não enviada'
      render :new
    end
  end
end
