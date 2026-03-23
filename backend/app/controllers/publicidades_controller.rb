class PublicidadesController < ApplicationController
  include Rails.application.routes.url_helpers

  def index
    publicidades = Publicidade
      .includes(:estados, imagem_attachment: :blob)
      .order(created_at: :desc)

    if params[:estado_id].present?
      publicidades = publicidades
        .joins(:estados)
        .where(estados: { id: params[:estado_id] })
        .distinct
    end

    render json: publicidades.map { |publicidade| publicidade_json(publicidade) }
  end

  def show
    publicidade = Publicidade
      .includes(:estados, imagem_attachment: :blob)
      .find(params[:id])

    render json: publicidade_json(publicidade)
  end

  def create
    publicidade = Publicidade.new(publicidade_params)

    if publicidade.save
      render json: publicidade_json(publicidade), status: :created
    else
      render json: { errors: publicidade.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    publicidade = Publicidade.find(params[:id])

    if publicidade.update(publicidade_params)
      render json: publicidade_json(publicidade)
    else
      render json: { errors: publicidade.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    publicidade = Publicidade.find(params[:id])
    publicidade.destroy
    head :no_content
  end

  def encerrar
    publicidade = Publicidade.find(params[:id])
    publicidade.update!(encerrada_em: Time.current)
    render json: publicidade_json(publicidade)
  end

  private

  def publicidade_params
    params.require(:publicidade).permit(
      :titulo,
      :descricao,
      :botao_link,
      :titulo_botao_link,
      :dt_inicio,
      :dt_fim,
      :imagem,
      estado_ids: []
    )
  end

  def publicidade_json(publicidade)
    host = ENV.fetch("APP_HOST", "localhost")
    port = ENV.fetch("APP_PORT", "3000")

    imagem_url =
      if publicidade.imagem.attached?
        "http://#{host}:#{port}#{rails_blob_path(publicidade.imagem, only_path: true)}"
      else
        nil
      end

    publicidade.as_json(
      only: [
        :id,
        :titulo,
        :descricao,
        :botao_link,
        :titulo_botao_link,
        :dt_inicio,
        :dt_fim,
        :encerrada_em,
        :created_at,
        :updated_at
      ],
      include: {
        estados: {
          only: [:id, :descricao, :sigla]
        }
      }
    ).merge(
      imagem_url: imagem_url,
      status: publicidade.encerrada_em.present? ? "encerrada" : "ativa"
    )
  end
end