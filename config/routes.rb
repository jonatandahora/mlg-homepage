Homepage::Application.routes.draw do

  get "vagas/index"
  match '/vagas/web_designer',     to: 'vagas#web_designer',             via: 'get'
  resources "vagas", only: [:web_designer]


  get "tutoriais/index"
  resources :tutoriais

  get "home/index"
  resources :contacts

  match '/contato',     to: 'contacts#new',             via: 'get'
  match '/contato',     to: 'contacts#create',             via: 'post'
  resources "contato", only: [:new, :create]
  get "mlg_brasil_na_midia/index"
  get "nosso_time/index"
  get "quem_somos/index"


  get "channels/index"
  match '/channels/channel',     to: 'channels#channel',             via: 'get'
  resources "channels", only: [:channel]

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
   root 'home#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products
  resources :mlg_brasil_na_midia
  resources :nosso_time
  resources :quem_somos
  resources :mlg_na_midia
  resources :channels


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
