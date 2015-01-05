Homepage::Application.routes.draw do

  root 'home#index'
  get "home/index"
  get "channels/index"
  match '/channels/channel',     to: 'channels#channel',             via: 'get'
  resources "channels", only: [:channel]
  resources :channels

  match 'vagas/web_designer', to: 'vagas#web_designer', via: 'get'
  match 'vagas', to: 'vagas#index', via: 'get'
  match 'tutoriais', to: 'tutoriais#index', via: 'get'
  match 'mlg_brasil_na_midia', to: 'mlg_brasil_na_midia#index', via: 'get'
  match 'nosso_time', to: 'nosso_time#index', via: 'get'
  match 'quem_somos', to: 'quem_somos#index', via: 'get'

  resources :contacts

  match '/contato',     to: 'contacts#new',             via: 'get'
  match '/contato',     to: 'contacts#create',             via: 'post'
  resources "contato", only: [:new, :create]

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"


  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products
  #resources :mlg_brasil_na_midia
  #resources :nosso_time
  #resources :quem_somos
  #resources :mlg_na_midia


  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
