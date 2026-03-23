# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
estados = [
  { descricao: "Acre", sigla: "AC" },
  { descricao: "Alagoas", sigla: "AL" },
  { descricao: "Amapá", sigla: "AP" },
  { descricao: "Amazonas", sigla: "AM" },
  { descricao: "Bahia", sigla: "BA" },
  { descricao: "Ceará", sigla: "CE" },
  { descricao: "Distrito Federal", sigla: "DF" },
  { descricao: "Espírito Santo", sigla: "ES" },
  { descricao: "Goiás", sigla: "GO" },
  { descricao: "Maranhão", sigla: "MA" },
  { descricao: "Mato Grosso", sigla: "MT" },
  { descricao: "Mato Grosso do Sul", sigla: "MS" },
  { descricao: "Minas Gerais", sigla: "MG" },
  { descricao: "Pará", sigla: "PA" },
  { descricao: "Paraíba", sigla: "PB" },
  { descricao: "Paraná", sigla: "PR" },
  { descricao: "Pernambuco", sigla: "PE" },
  { descricao: "Piauí", sigla: "PI" },
  { descricao: "Rio de Janeiro", sigla: "RJ" },
  { descricao: "Rio Grande do Norte", sigla: "RN" },
  { descricao: "Rio Grande do Sul", sigla: "RS" },
  { descricao: "Rondônia", sigla: "RO" },
  { descricao: "Roraima", sigla: "RR" },
  { descricao: "Santa Catarina", sigla: "SC" },
  { descricao: "São Paulo", sigla: "SP" },
  { descricao: "Sergipe", sigla: "SE" },
  { descricao: "Tocantins", sigla: "TO" }
]

estados.each do |estado|
  Estado.find_or_create_by!(sigla: estado[:sigla]) do |e|
    e.descricao = estado[:descricao]
  end
end

puts "Estados cadastrados com sucesso!"