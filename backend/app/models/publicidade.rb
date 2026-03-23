class Publicidade < ApplicationRecord
  has_many :publicidade_estados, dependent: :destroy
  has_many :estados, through: :publicidade_estados

  has_one_attached :imagem

  validates :titulo, presence: true
  validates :descricao, presence: true
  validates :botao_link, presence: true
  validates :titulo_botao_link, presence: true
  validates :dt_inicio, presence: true
  validates :dt_fim, presence: true
  validates :imagem, presence: true, on: :create
  validates :estado_ids, presence: true

  validate :data_fim_maior_ou_igual_inicio
  validate :apenas_uma_publicidade_ativa_no_periodo_por_estado, unless: :encerrada?

  def encerrada?
    respond_to?(:encerrada_em) && encerrada_em.present?
  end

  private

  def data_fim_maior_ou_igual_inicio
    return if dt_inicio.blank? || dt_fim.blank?

    if dt_fim < dt_inicio
      errors.add(:dt_fim, "deve ser maior ou igual à data de início")
    end
  end

  def apenas_uma_publicidade_ativa_no_periodo_por_estado
    return if dt_inicio.blank? || dt_fim.blank? || estado_ids.blank?

    conflito = Publicidade
      .joins(:publicidade_estados)
      .where.not(id: id)
      .where(encerrada_em: nil)
      .where(publicidade_estados: { estado_id: estado_ids })
      .where("dt_inicio <= ? AND dt_fim >= ?", dt_fim, dt_inicio)
      .distinct

    if conflito.exists?
      errors.add(:base, "Já existe uma publicidade ativa nesse período para um dos estados selecionados")
    end
  end
end