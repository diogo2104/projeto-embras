class AddEncerradaEmToPublicidades < ActiveRecord::Migration[8.1]
  def change
    add_column :publicidades, :encerrada_em, :datetime
  end
end
