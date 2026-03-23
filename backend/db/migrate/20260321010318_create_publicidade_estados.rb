class CreatePublicidadeEstados < ActiveRecord::Migration[8.1]
  def change
    create_table :publicidade_estados do |t|
      t.references :publicidade, null: false, foreign_key: true
      t.references :estado, null: false, foreign_key: true

      t.timestamps
    end
  end
end
