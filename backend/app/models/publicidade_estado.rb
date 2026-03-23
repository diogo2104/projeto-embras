class PublicidadeEstado < ApplicationRecord
  belongs_to :publicidade
  belongs_to :estado
end