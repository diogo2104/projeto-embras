class CreatePublicidades < ActiveRecord::Migration[8.1]
  def change
    create_table :publicidades do |t|
      t.string :titulo
      t.text :descricao
      t.string :botao_link
      t.string :titulo_botao_link
      t.date :dt_inicio
      t.date :dt_fim

      t.timestamps
    end
  end
end
