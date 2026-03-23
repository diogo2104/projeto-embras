class Estado < ApplicationRecord
  has_many :publicidade_estados, dependent: :destroy
  has_many :publicidades, through: :publicidade_estados

  validates :descricao, presence: true
  validates :sigla, presence: true, length: { is: 2 }
end