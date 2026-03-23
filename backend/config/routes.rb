Rails.application.routes.draw do
  resources :estados
  resources :publicidades do
    member do
      patch :encerrar
    end
  end
end